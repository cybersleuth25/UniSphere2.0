package unisphere

import grails.gorm.transactions.Transactional

/**
 * CommentService - handles comment listing and creation.
 *
 * PHP origin: api.php (GET postId for comments, POST commentContent)
 */
@Transactional
class CommentService {

    /**
     * Get all comments for a specific post.
     * PHP equivalent: api.php GET with postId parameter
     */
    @Transactional(readOnly = true)
    List<Map> getComments(String postId) {
        List<Comment> comments = Comment.findAll(
            "FROM Comment c WHERE c.postId = :postId ORDER BY c.createdAt DESC",
            [postId: postId]
        )

        return comments.collect { c ->
            User user = User.findByEmail(c.authorEmail)
            [
                id: c.id,
                post_id: c.postId,
                author_email: c.authorEmail,
                username: user?.username ?: 'Unknown',
                content: c.content,
                created_at: c.createdAt ? new java.text.SimpleDateFormat('yyyy-MM-dd HH:mm:ss').format(c.createdAt) : null
            ]
        }
    }

    /**
     * Add a new comment to a post.
     * PHP equivalent: api.php POST with commentContent
     */
    Map addComment(String postId, String authorEmail, String content) {
        Comment comment = new Comment(
            postId: postId,
            authorEmail: authorEmail,
            content: content,
            createdAt: new Date()
        )

        if (comment.save(flush: true)) {
            return [success: true, message: 'Comment posted.']
        } else {
            return [success: false, message: 'Error posting comment.']
        }
    }
}
