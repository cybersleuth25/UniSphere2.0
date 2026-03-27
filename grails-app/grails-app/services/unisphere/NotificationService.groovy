package unisphere

import grails.gorm.transactions.Transactional

/**
 * NotificationService - handles user notifications.
 *
 * PHP origin: notifications.php
 */
@Transactional
class NotificationService {

    /**
     * Get all notifications for a user, ordered by newest first.
     * PHP equivalent: notifications.php
     */
    @Transactional(readOnly = true)
    List<Map> getNotifications(String userEmail) {
        List<Notification> notifications = Notification.findAllByUserEmail(
            userEmail,
            [sort: 'createdAt', order: 'desc']
        )

        return notifications.collect { n ->
            [
                id: n.id,
                user_email: n.userEmail,
                message: n.message,
                type: n.type,
                is_read: n.isRead,
                created_at: n.createdAt ? new java.text.SimpleDateFormat('yyyy-MM-dd HH:mm:ss').format(n.createdAt) : null
            ]
        }
    }

    /**
     * Create a new notification for a user.
     */
    Notification createNotification(String userEmail, String message, String type = 'info') {
        Notification notification = new Notification(
            userEmail: userEmail,
            message: message,
            type: type,
            isRead: false,
            createdAt: new Date()
        )
        notification.save(flush: true)
        return notification
    }

    /**
     * Mark a notification as read.
     */
    void markAsRead(Long notificationId) {
        Notification notification = Notification.get(notificationId)
        if (notification) {
            notification.isRead = true
            notification.save(flush: true)
        }
    }
}
