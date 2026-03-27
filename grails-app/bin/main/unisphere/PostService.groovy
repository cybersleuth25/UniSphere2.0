package unisphere

import grails.gorm.transactions.Transactional

/**
 * PostService - handles post CRUD, likes, and search.
 *
 * PHP origin: api.php (all cases: GET, POST, PUT, DELETE)
 */
@Transactional
class PostService {

    FileUploadService fileUploadService

    /**
     * List posts by type, optionally filtered by search query.
     * PHP equivalent: api.php GET (postType + search params)
     */
    @Transactional(readOnly = true)
    List<Post> listByType(String postType, String search = null) {
        if (!postType) return []

        if (search) {
            String searchTerm = "%${search}%"
            return Post.findAll(
                "FROM Post p WHERE p.postType = :type AND (p.title LIKE :search OR p.description LIKE :search) ORDER BY p.date DESC",
                [type: postType, search: searchTerm]
            )
        } else {
            return Post.findAllByPostType(postType, [sort: 'date', order: 'desc'])
        }
    }

    /**
     * Global search across posts and users.
     * PHP equivalent: api.php GET (globalSearch param)
     */
    @Transactional(readOnly = true)
    Map globalSearch(String query) {
        String searchTerm = "%${query}%"

        List<Post> posts = Post.findAll(
            "FROM Post p WHERE p.title LIKE :search OR p.description LIKE :search",
            [search: searchTerm]
        )

        List<User> users = User.findAll(
            "FROM User u WHERE u.username LIKE :search",
            [search: searchTerm]
        )

        return [
            posts: posts.collect { p ->
                [id: p.id, title: p.title, description: p.description, postType: p.postType]
            },
            users: users.collect { u ->
                [username: u.username, email: u.email, bio: u.bio, avatar_path: u.avatarPath, branch: u.branch, semester: u.semester]
            }
        ]
    }

    /**
     * Create a new post.
     * PHP equivalent: api.php POST (new post creation)
     */
    Map createPost(String postType, String title, String description, String authorEmail, 
                   org.springframework.web.multipart.MultipartFile imageFile = null) {
        
        // Generate unique ID like PHP's uniqid('post_')
        String postId = "post_${UUID.randomUUID().toString().replace('-', '').substring(0, 13)}"

        String imagePath = null
        if (imageFile && !imageFile.empty) {
            imagePath = fileUploadService.uploadPostImage(imageFile)
            if (!imagePath) {
                return [success: false, message: 'Failed to upload image.']
            }
        }

        Post post = new Post(
            id: postId,
            postType: postType,
            title: title ?: 'No Title',
            description: description ?: '',
            date: new Date(),
            author: authorEmail,
            image: imagePath,
            likes: 0
        )

        if (post.save(flush: true)) {
            return [success: true, message: 'Post created successfully.']
        } else {
            return [success: false, message: "Error: ${post.errors.allErrors.collect { it.defaultMessage }.join(', ')}"]
        }
    }

    /**
     * Update an existing post (with authorization check).
     * PHP equivalent: api.php PUT
     */
    Map updatePost(String postId, String title, String description, String authorEmail, boolean isAdmin) {
        Post post = Post.get(postId)
        if (!post) {
            return [success: false, message: 'Post not found.']
        }

        // Authorization: only author or admin can edit
        if (!isAdmin && post.author != authorEmail) {
            return [success: false, message: 'Permission denied.']
        }

        post.title = title
        post.description = description

        if (post.save(flush: true)) {
            return [success: true, message: 'Post updated successfully.']
        } else {
            return [success: false, message: 'Update failed.']
        }
    }

    /**
     * Delete a post (with authorization check).
     * PHP equivalent: api.php DELETE
     */
    Map deletePost(String postId, String authorEmail, boolean isAdmin) {
        Post post = Post.get(postId)
        if (!post) {
            return [success: false, message: 'Post not found.']
        }

        // Authorization: only author or admin can delete
        if (!isAdmin && post.author != authorEmail) {
            return [success: false, message: 'Permission denied.']
        }

        post.delete(flush: true)
        return [success: true, message: 'Post deleted successfully.']
    }

    /**
     * Increment like count for a post.
     * PHP equivalent: api.php POST (likePostId)
     */
    Map likePost(String postId) {
        Post post = Post.get(postId)
        if (!post) {
            return [success: false]
        }

        post.likes = (post.likes ?: 0) + 1
        post.save(flush: true)

        return [success: true, likes: post.likes]
    }
}
