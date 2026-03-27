package unisphere

import groovy.transform.ToString

/**
 * Post domain class.
 * Maps to the existing 'posts' table in MySQL.
 *
 * PHP origin: api.php (CRUD operations), post.php
 * 
 * Post types: announcements, events, lostfound, resources, groups, courses
 */
@ToString(includes = ['id', 'postType', 'title'])
class Post {

    String id                          // custom string ID (e.g., 'post_6651a...')
    String postType                    // announcements, events, lostfound, resources, groups, courses
    String title
    String description
    Date date
    String author                      // author email address
    String image                       // path to uploaded image
    Integer likes = 0

    Date dateCreated
    Date lastUpdated

    // Comments reference posts via string postId, not GORM associations

    static constraints = {
        id        blank: false, maxSize: 100
        postType  blank: false, inList: ['announcements', 'events', 'lostfound', 'resources', 'groups', 'courses']
        title     blank: false, maxSize: 255
        description nullable: true, maxSize: 10000
        date      nullable: true
        author    blank: false, maxSize: 255
        image     nullable: true, maxSize: 500
        likes     min: 0
    }

    static mapping = {
        table 'posts'
        id generator: 'assigned'       // We assign IDs ourselves (like PHP's uniqid)
        postType column: 'postType'
        description type: 'text'
        version false                   // PHP didn't use optimistic locking
    }
}
