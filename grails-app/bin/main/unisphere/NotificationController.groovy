package unisphere

import grails.converters.JSON

/**
 * NotificationController - handles user notifications API.
 *
 * PHP origin: notifications.php
 */
class NotificationController {

    NotificationService notificationService

    /**
     * List notifications for the logged-in user.
     * PHP equivalent: notifications.php
     */
    def list() {
        response.contentType = 'application/json'

        if (!session.user_email) {
            response.status = 401
            render([] as JSON)
            return
        }

        List<Map> notifications = notificationService.getNotifications(session.user_email)
        render(notifications as JSON)
    }

    /**
     * Mark a notification as read.
     */
    def markRead() {
        response.contentType = 'application/json'

        if (!session.user_email) {
            response.status = 401
            render([success: false] as JSON)
            return
        }

        notificationService.markAsRead(params.long('id'))
        render([success: true] as JSON)
    }
}
