package unisphere

/**
 * Bootstrap - runs on application startup.
 * Seeds an initial admin user if none exists.
 */
class BootStrap {

    def init = { servletContext ->
        println "=== UniSphere BootStrap: Starting ==="

        try {
            // Create default admin user if no users exist
            User.withTransaction { status ->
                try {
                    int userCount = User.count()
                    println "=== BootStrap: Found ${userCount} existing users ==="

                    if (userCount == 0) {
                        println "=== BootStrap: Creating default admin user... ==="
                        def encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                        String hashedPassword = encoder.encode('admin123')

                        User admin = new User(
                            username: 'admin',
                            email: 'admin@unisphere.edu',
                            password: hashedPassword,
                            role: 'admin',
                            branch: 'Computer Science',
                            semester: 1
                        )

                        if (admin.validate()) {
                            admin.save(flush: true, failOnError: true)
                            println "=== BootStrap: Default admin created: admin@unisphere.edu / admin123 ==="
                        } else {
                            println "=== BootStrap: Validation errors: ${admin.errors.allErrors} ==="
                        }
                    }
                } catch (Exception inner) {
                    println "=== BootStrap: Error inside transaction: ${inner.message} ==="
                    inner.printStackTrace()
                    status.setRollbackOnly()
                }
            }
        } catch (Exception e) {
            println "=== BootStrap: Fatal error during init: ${e.message} ==="
            e.printStackTrace()
            // Don't rethrow — allow app to start even if seeding fails
        }

        println "=== UniSphere BootStrap: Complete ==="
    }

    def destroy = {
    }
}
