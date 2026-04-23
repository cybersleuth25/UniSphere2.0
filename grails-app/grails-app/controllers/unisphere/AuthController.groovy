package unisphere

import grails.converters.JSON

/**
 * AuthController - handles authentication pages and actions.
 *
 * PHP origin: login.php, signup.php, logout.php, forgot-password.php, reset-password.php
 */
class AuthController {

    AuthService authService
    JwtService jwtService

    /**
     * Render login page.
     * PHP equivalent: login.html
     */
    def login() {
        render(view: 'login')
    }

    /**
     * Handle login form submission.
     * PHP equivalent: login.php
     */
    def doLogin() {
        if (request.method != 'POST') {
            response.status = 405
            render([success: false, message: 'Method not allowed.'] as JSON)
            return
        }

        String email = params.username  // matches PHP's form field name
        String password = params.password

        User user = authService.authenticate(email, password)

        if (user) {
            session.user_email = user.email
            session.user_role = user.role

            String token = jwtService.generateToken(user.email)

            render([
                success: true,
                message: 'Login successful.',
                token: token,
                user: [
                    username: user.username,
                    email: user.email,
                    role: user.role
                ]
            ] as JSON)
        } else {
            response.status = 401
            render([success: false, message: 'Invalid email or password.'] as JSON)
        }
    }

    /**
     * Render signup page.
     * PHP equivalent: signup.html
     */
    def signup() {
        render(view: 'signup')
    }

    /**
     * Handle signup form submission.
     * PHP equivalent: signup.php
     */
    def doSignup() {
        if (request.method != 'POST') {
            response.status = 405
            render([success: false, message: 'Method not allowed.'] as JSON)
            return
        }

        Map result = authService.register(
            params.newUsername,
            params.newEmail,
            params.newPassword,
            params.branch,
            params.int('semester')
        )

        if (result.success) {
            session.user_email = params.newEmail
            session.user_role = 'student'
            result.token = jwtService.generateToken(params.newEmail)
        } else {
            response.status = result.message?.contains('already registered') ? 409 : 500
        }

        render(result as JSON)
    }

    /**
     * Logout - destroy session and redirect.
     * PHP equivalent: logout.php
     */
    def logout() {
        session.invalidate()
        redirect(action: 'login')
    }

    /**
     * Render forgot password page.
     * PHP equivalent: forgot-password.html
     */
    def forgotPassword() {
        render(view: 'forgotPassword')
    }

    /**
     * Handle forgot password form submission.
     * PHP equivalent: forgot-password.php
     */
    def doForgotPassword() {
        if (request.method != 'POST') {
            response.status = 405
            render([success: false, message: 'Method not allowed.'] as JSON)
            return
        }

        Map result = authService.initiatePasswordReset(params.email)
        render(result as JSON)
    }

    /**
     * Render reset password page.
     * PHP equivalent: reset-password.html
     */
    def resetPassword() {
        render(view: 'resetPassword')
    }

    /**
     * Handle reset password form submission.
     * PHP equivalent: reset-password.php
     */
    def doResetPassword() {
        if (request.method != 'POST') {
            response.status = 405
            render([success: false, message: 'Method not allowed.'] as JSON)
            return
        }

        Map result = authService.resetPassword(params.token, params.newPassword)
        if (!result.success) {
            response.status = 400
        }
        render(result as JSON)
    }
}
