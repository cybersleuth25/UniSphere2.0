package unisphere

import groovy.transform.ToString

/**
 * Comment domain class.
 * Maps to the existing 'comments' table in MySQL.
 *
 * PHP origin: api.php (POST comments, GET comments by postId)
 */
@ToString(includes = ['id', 'postId', 'authorEmail'])
class Comment {

    String postId                      // references Post.id
    String authorEmail                 // references User.email
    String content
    Date createdAt

    Date dateCreated
    Date lastUpdated

    // Note: postId is a string reference, not a GORM association

    static constraints = {
        postId      blank: false, maxSize: 100
        authorEmail blank: false, maxSize: 255
        content     blank: false, maxSize: 5000
        createdAt   nullable: true
    }

    static mapping = {
        table 'comments'
        postId column: 'post_id'
        authorEmail column: 'author_email'
        createdAt column: 'created_at'
        content type: 'text'
    }
}
