package unisphere

import groovy.transform.ToString

/**
 * Notification domain class.
 * Maps to the existing 'notifications' table in MySQL.
 *
 * PHP origin: notifications.php (GET user notifications)
 */
@ToString(includes = ['id', 'userEmail'])
class Notification {

    String userEmail                   // references User.email
    String message
    String type                        // e.g., 'info', 'warning', 'success'
    Boolean isRead = false
    Date createdAt

    Date dateCreated
    Date lastUpdated

    static constraints = {
        userEmail  blank: false, maxSize: 255
        message    nullable: true, maxSize: 1000
        type       nullable: true, maxSize: 50
        isRead     nullable: false
        createdAt  nullable: true
    }

    static mapping = {
        table 'notifications'
        userEmail column: 'user_email'
        createdAt column: 'created_at'
        isRead column: 'is_read'
    }
}
