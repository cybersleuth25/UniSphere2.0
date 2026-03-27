package unisphere

/**
 * URL Mappings - routes HTTP requests to controllers/actions.
 *
 * Maps the PHP file-based routing to Grails convention-based routing.
 *
 * PHP routing equivalents:
 *   login.html      → /auth/login
 *   signup.html     → /auth/signup
 *   login.php       → /auth/doLogin (POST)
 *   signup.php       → /auth/doSignup (POST)
 *   logout.php      → /auth/logout
 *   forgot-password  → /auth/forgotPassword
 *   reset-password   → /auth/resetPassword
 *   api.php          → /api/posts/* (REST endpoints)
 *   profile.php      → /profile/*
 *   notifications.php → /api/notifications
 */
class UrlMappings {

    static mappings = {

        // ===== Main Dashboard =====
        "/"(controller: 'main', action: 'index')

        // ===== Authentication =====
        "/login"(controller: 'auth', action: 'login')
        "/signup"(controller: 'auth', action: 'signup')
        "/auth/doLogin"(controller: 'auth', action: 'doLogin')
        "/auth/doSignup"(controller: 'auth', action: 'doSignup')
        "/logout"(controller: 'auth', action: 'logout')
        "/forgot-password"(controller: 'auth', action: 'forgotPassword')
        "/auth/doForgotPassword"(controller: 'auth', action: 'doForgotPassword')
        "/reset-password"(controller: 'auth', action: 'resetPassword')
        "/auth/doResetPassword"(controller: 'auth', action: 'doResetPassword')

        // ===== Posts API (replaces api.php) =====
        "/api/posts"(controller: 'post') {
            action = [GET: 'index', POST: 'save', PUT: 'update', OPTIONS: 'options']
        }
        "/api/posts/search"(controller: 'post', action: 'globalSearch')
        "/api/posts/like"(controller: 'post', action: 'like')
        "/api/posts/comments"(controller: 'post') {
            action = [GET: 'comments', POST: 'addComment']
        }
        "/api/posts/$id"(controller: 'post') {
            action = [DELETE: 'delete']
        }

        // ===== Profile =====
        "/profile"(controller: 'profile', action: 'show')
        "/profile/$username"(controller: 'profile', action: 'show')
        "/profile/update"(controller: 'profile', action: 'update')
        "/profile/uploadAvatar"(controller: 'profile', action: 'uploadAvatar')

        // ===== Notifications API (replaces notifications.php) =====
        "/api/notifications"(controller: 'notification', action: 'list')
        "/api/notifications/markRead"(controller: 'notification', action: 'markRead')

        // ===== Default mappings =====
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
