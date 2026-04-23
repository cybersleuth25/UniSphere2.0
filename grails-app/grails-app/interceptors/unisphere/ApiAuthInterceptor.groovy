package unisphere

import grails.converters.JSON

class ApiAuthInterceptor {

    JwtService jwtService

    ApiAuthInterceptor() {
        matchAll()
        .excludes(controller: 'auth')
        .excludes(uri: '/')
        .excludes(uri: '/index')
        .excludes(uri: '/error')
        .excludes(uri: '/notFound')
        .excludes(uri: '/login')
        .excludes(uri: '/signup')
        .excludes(uri: '/logout')
        .excludes(uri: '/forgot-password')
        .excludes(uri: '/reset-password')
        .excludes(uri: '/auth/**')
    }

    boolean before() {
        // Allow session-based users (Web App)
        if (session.user_email) {
            return true
        }

        // Allow JWT-based users (Mobile App)
        String authHeader = request.getHeader("Authorization")
        if (authHeader && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7)
            String email = jwtService.extractEmail(token)
            if (email) {
                // Look up user to get role — critical for admin permission checks
                User user = User.findByEmail(email)
                if (user) {
                    session.user_email = user.email
                    session.user_role = user.role
                    return true
                }
            }
        }

        // If no valid session or JWT token, reject API requests
        if (request.xhr || request.requestURI.startsWith('/api')) {
            response.status = 401
            render([success: false, message: 'Unauthorized'] as JSON)
            return false
        }

        // Otherwise, redirect to login page for regular web views
        redirect(controller: 'auth', action: 'login')
        return false
    }

    boolean after() { true }
    void afterView() { }
}
