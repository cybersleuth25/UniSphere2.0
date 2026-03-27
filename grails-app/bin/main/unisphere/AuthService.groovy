package unisphere

import grails.gorm.transactions.Transactional
import java.security.MessageDigest

/**
 * AuthService - handles authentication, registration, and password reset.
 *
 * PHP origin: login.php, signup.php, forgot-password.php, reset-password.php
 */
@Transactional
class AuthService {

    /**
     * Authenticate a user by email and password.
     * PHP equivalent: login.php
     *
     * @param email    User's email
     * @param password Plain-text password
     * @return User if credentials valid, null otherwise
     */
    User authenticate(String email, String password) {
        User user = User.findByEmail(email)
        if (!user) return null

        // Verify password using BCrypt (matching PHP's password_verify)
        if (verifyPassword(password, user.password)) {
            return user
        }
        return null
    }

    /**
     * Register a new user account.
     * PHP equivalent: signup.php
     *
     * @return Map with 'success' boolean and 'message' or 'user'
     */
    Map register(String username, String email, String password, String branch, Integer semester) {
        // Check for existing email
        if (User.findByEmail(email)) {
            return [success: false, message: 'Email already registered. Try logging in.']
        }

        String hashedPassword = hashPassword(password)

        User user = new User(
            username: username,
            email: email,
            password: hashedPassword,
            role: 'student',
            branch: branch,
            semester: semester
        )

        if (user.save(flush: true)) {
            return [
                success: true,
                message: 'Account created successfully.',
                user: [
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    branch: user.branch,
                    semester: user.semester
                ]
            ]
        } else {
            return [success: false, message: "Error creating account: ${user.errors.allErrors.collect { it.defaultMessage }.join(', ')}"]
        }
    }

    /**
     * Initiate password reset - generate token.
     * PHP equivalent: forgot-password.php
     */
    Map initiatePasswordReset(String email) {
        User user = User.findByEmail(email)

        // Always return same message to prevent email enumeration
        Map response = [success: true, message: 'If an account exists, a reset link has been sent.']

        if (user) {
            // Generate random token
            byte[] randomBytes = new byte[32]
            new java.security.SecureRandom().nextBytes(randomBytes)
            String token = randomBytes.encodeHex().toString()
            String tokenHash = sha256(token)

            // Set expiry to 30 minutes from now
            Calendar cal = Calendar.getInstance()
            cal.add(Calendar.MINUTE, 30)

            user.resetToken = tokenHash
            user.resetTokenExpiry = cal.time
            user.save(flush: true)

            String resetUrl = "reset-password?token=${token}"
            response.reset_url = resetUrl
        }

        return response
    }

    /**
     * Reset password using token.
     * PHP equivalent: reset-password.php
     */
    Map resetPassword(String token, String newPassword) {
        if (!token || !newPassword) {
            return [success: false, message: 'Token and password are required.']
        }

        String tokenHash = sha256(token)
        User user = User.findByResetToken(tokenHash)

        if (!user) {
            return [success: false, message: 'Invalid reset link.']
        }

        if (user.resetTokenExpiry <= new Date()) {
            return [success: false, message: 'Reset link has expired.']
        }

        user.password = hashPassword(newPassword)
        user.resetToken = null
        user.resetTokenExpiry = null

        if (user.save(flush: true)) {
            return [success: true, message: 'Password has been reset successfully.']
        } else {
            return [success: false, message: 'Error resetting password.']
        }
    }

    // --- Private helpers ---

    /**
     * Hash password using BCrypt (equivalent to PHP's password_hash).
     */
    private String hashPassword(String password) {
        // Using Spring Security's BCrypt encoder
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(password)
    }

    /**
     * Verify password against BCrypt hash (equivalent to PHP's password_verify).
     */
    private boolean verifyPassword(String rawPassword, String hashedPassword) {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().matches(rawPassword, hashedPassword)
    }

    /**
     * SHA-256 hash (for reset tokens, matching PHP's hash('sha256', ...)).
     */
    private String sha256(String input) {
        MessageDigest digest = MessageDigest.getInstance('SHA-256')
        byte[] hash = digest.digest(input.getBytes('UTF-8'))
        return hash.encodeHex().toString()
    }
}
