package unisphere

import grails.converters.JSON

/**
 * PostController - REST-style controller for posts, comments, and likes.
 *
 * PHP origin: api.php (all HTTP methods)
 */
class PostController {

    PostService postService
    CommentService commentService

    /**
     * Before each action, set JSON content type.
     */
    def beforeInterceptor = {
        response.contentType = 'application/json'
    }

    /**
     * Handle OPTIONS requests (CORS preflight).
     * PHP equivalent: api.php OPTIONS handling
     */
    def options() {
        response.status = 200
        render ''
    }

    /**
     * GET: List posts by type with optional search.
     * PHP equivalent: api.php GET (postType + search params)
     */
    def index() {
        String postType = params.postType
        String search = params.search

        if (!postType) {
            render([] as JSON)
            return
        }

        List<Post> posts = postService.listByType(postType, search)
        render(posts.collect { p ->
            [
                id: p.id,
                postType: p.postType,
                title: p.title,
                description: p.description,
                date: p.date ? new java.text.SimpleDateFormat('yyyy-MM-dd').format(p.date) : null,
                author: p.author,
                image: p.image,
                likes: p.likes ?: 0
            ]
        } as JSON)
    }

    /**
     * GET: Global search across posts and users.
     * PHP equivalent: api.php GET (globalSearch param)
     */
    def globalSearch() {
        String query = params.globalSearch
        if (!query) {
            render([posts: [], users: []] as JSON)
            return
        }

        Map results = postService.globalSearch(query)
        render(results as JSON)
    }

    /**
     * GET: List comments for a post.
     * PHP equivalent: api.php GET (postId param for comments)
     */
    def comments() {
        String postId = params.postId
        if (!postId) {
            render([] as JSON)
            return
        }

        List<Map> commentList = commentService.getComments(postId)
        render(commentList as JSON)
    }

    /**
     * POST: Create a new post.
     * PHP equivalent: api.php POST (new post, with optional image)
     */
    def save() {
        // Check authentication
        if (!session.user_email) {
            response.status = 401
            render([success: false, message: 'Authentication required.'] as JSON)
            return
        }

        String postType = params.postType
        String authorEmail = session.user_email
        boolean isAdmin = session.user_role == 'admin'

        // Check permissions: only admins can post announcements/events
        if (!isAdmin && (postType == 'announcements' || postType == 'events')) {
            response.status = 403
            render([success: false, message: 'Permission denied.'] as JSON)
            return
        }

        def imageFile = request.getFile('image')
        Map result = postService.createPost(
            postType,
            params.title,
            params.description,
            authorEmail,
            imageFile
        )

        render(result as JSON)
    }

    /**
     * PUT: Update an existing post.
     * PHP equivalent: api.php PUT
     */
    def update() {
        if (!session.user_email) {
            response.status = 401
            render '' 
            return
        }

        // Read JSON body (matching PHP's file_get_contents('php://input'))
        def requestBody = request.JSON
        String postId = requestBody.id
        String title = requestBody.title
        String description = requestBody.description
        boolean isAdmin = session.user_role == 'admin'

        Map result = postService.updatePost(postId, title, description, session.user_email, isAdmin)

        if (!result.success && result.message == 'Permission denied.') {
            response.status = 403
        }

        render(result as JSON)
    }

    /**
     * DELETE: Delete a post.
     * PHP equivalent: api.php DELETE
     */
    def delete() {
        if (!session.user_email) {
            response.status = 401
            render ''
            return
        }

        String postId = params.id
        boolean isAdmin = session.user_role == 'admin'

        Map result = postService.deletePost(postId, session.user_email, isAdmin)

        if (!result.success && result.message == 'Permission denied.') {
            response.status = 403
        }

        render(result as JSON)
    }

    /**
     * POST: Like a post.
     * PHP equivalent: api.php POST (likePostId)
     */
    def like() {
        String postId = params.likePostId
        Map result = postService.likePost(postId)
        render(result as JSON)
    }

    /**
     * POST: Add a comment.
     * PHP equivalent: api.php POST (commentContent)
     */
    def addComment() {
        if (!session.user_email) {
            response.status = 401
            render([success: false, message: 'Authentication required.'] as JSON)
            return
        }

        Map result = commentService.addComment(
            params.postId,
            session.user_email,
            params.commentContent
        )

        render(result as JSON)
    }
}
