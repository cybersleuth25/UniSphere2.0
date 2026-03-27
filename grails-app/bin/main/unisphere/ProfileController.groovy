package unisphere

import grails.converters.JSON

/**
 * ProfileController - handles user profile view, edit, and avatar upload.
 *
 * PHP origin: profile.php, update-profile.php, upload-avatar.php
 */
class ProfileController {

    UserService userService

    /**
     * Show profile page (own profile or another user's).
     * PHP equivalent: profile.php
     */
    def show() {
        boolean isOwnProfile = false
        Map user = null

        if (params.username) {
            // Viewing another user's profile (or own by username)
            user = userService.getProfileByUsername(params.username)

            if (session.user_email && user && session.user_email == user.email) {
                isOwnProfile = true
            }
        } else if (session.user_email) {
            // Viewing own profile
            isOwnProfile = true
            user = userService.getProfileByEmail(session.user_email)
        } else {
            // Not logged in
            redirect(controller: 'auth', action: 'login')
            return
        }

        if (!user) {
            render "User not found."
            return
        }

        // Pass data to GSP view (equivalent to PHP's serverData)
        render(view: 'show', model: [
            user: user,
            isOwnProfile: isOwnProfile,
            userJson: (user as JSON).toString(),
            isOwnProfileJson: isOwnProfile.toString()
        ])
    }

    /**
     * Update user profile.
     * PHP equivalent: update-profile.php
     */
    def update() {
        response.contentType = 'application/json'

        if (!session.user_email) {
            response.status = 401
            render([success: false, message: 'Not authenticated'] as JSON)
            return
        }

        Map result = userService.updateProfile(
            session.user_email,
            params.username,
            params.email,
            params.bio
        )

        if (result.success) {
            // Update session email if it changed
            session.user_email = params.email
        } else {
            response.status = result.message?.contains('empty') ? 400 : 500
        }

        render(result as JSON)
    }

    /**
     * Upload user avatar.
     * PHP equivalent: upload-avatar.php
     */
    def uploadAvatar() {
        response.contentType = 'application/json'

        if (!session.user_email) {
            response.status = 401
            render([success: false, message: 'Authentication required.'] as JSON)
            return
        }

        def avatarFile = request.getFile('avatar')
        if (!avatarFile || avatarFile.empty) {
            render([success: false, message: 'No file uploaded.'] as JSON)
            return
        }

        Map result = userService.uploadAvatar(session.user_email, avatarFile)
        render(result as JSON)
    }
}
