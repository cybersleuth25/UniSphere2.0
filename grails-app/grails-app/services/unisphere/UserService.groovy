package unisphere

import grails.gorm.transactions.Transactional

/**
 * UserService - handles user profile operations.
 *
 * PHP origin: profile.php, update-profile.php, upload-avatar.php
 */
@Transactional
class UserService {

    FileUploadService fileUploadService

    /**
     * Get user profile by username.
     * PHP equivalent: profile.php (GET with username parameter)
     */
    @Transactional(readOnly = true)
    Map getProfileByUsername(String username) {
        User user = User.findByUsername(username)
        if (!user) return null

        return userToMap(user)
    }

    /**
     * Get user profile by email.
     * PHP equivalent: profile.php (session-based own profile)
     */
    @Transactional(readOnly = true)
    Map getProfileByEmail(String email) {
        User user = User.findByEmail(email)
        if (!user) return null

        return userToMap(user)
    }

    /**
     * Update user profile.
     * PHP equivalent: update-profile.php
     */
    Map updateProfile(String currentEmail, String newUsername, String newEmail, String newBio) {
        if (!newUsername || !newEmail) {
            return [success: false, message: 'Username and email cannot be empty.']
        }

        User user = User.findByEmail(currentEmail)
        if (!user) {
            return [success: false, message: 'User not found.']
        }

        user.username = newUsername
        user.email = newEmail
        user.bio = newBio

        if (user.save(flush: true)) {
            return [
                success: true,
                message: 'Profile updated successfully!',
                user: userToMap(user)
            ]
        } else {
            return [success: false, message: 'Error updating profile.']
        }
    }

    /**
     * Upload user avatar.
     * PHP equivalent: upload-avatar.php
     */
    Map uploadAvatar(String email, org.springframework.web.multipart.MultipartFile file) {
        User user = User.findByEmail(email)
        if (!user) {
            return [success: false, message: 'User not found.']
        }

        String filepath = fileUploadService.uploadAvatar(file)
        if (!filepath) {
            return [success: false, message: 'Failed to upload avatar.']
        }

        user.avatarPath = filepath
        if (user.save(flush: true)) {
            return [success: true, message: 'Avatar updated successfully!', filepath: filepath]
        } else {
            return [success: false, message: 'Failed to update database.']
        }
    }

    /**
     * Convert User domain object to a safe Map for JSON response.
     */
    private Map userToMap(User user) {
        return [
            username: user.username,
            email: user.email,
            bio: user.bio,
            avatar_path: user.avatarPath,
            role: user.role,
            branch: user.branch,
            semester: user.semester
        ]
    }
}
