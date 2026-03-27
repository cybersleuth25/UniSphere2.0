package unisphere

import groovy.transform.ToString

/**
 * User domain class.
 * Maps to the existing 'users' table in MySQL.
 *
 * PHP origin: users table (used by login.php, signup.php, profile.php, etc.)
 */
@ToString(includes = ['username', 'email', 'role'])
class User {

    String username
    String email
    String password
    String role = 'student'           // 'student' or 'admin'
    String branch
    Integer semester
    String bio
    String avatarPath                  // path to uploaded avatar image
    String resetToken                  // SHA-256 hashed token for password reset
    Date resetTokenExpiry              // expiry timestamp for reset token

    Date dateCreated
    Date lastUpdated

    // Relationships are managed via string email references, not GORM associations

    static constraints = {
        username    blank: false, size: 2..50
        email       blank: false, email: true, unique: true
        password    blank: false
        role        inList: ['student', 'admin']
        branch      nullable: true
        semester    nullable: true, range: 1..8
        bio         nullable: true, maxSize: 1000
        avatarPath  nullable: true
        resetToken  nullable: true
        resetTokenExpiry nullable: true
    }

    static mapping = {
        table 'users'
        password column: 'password'
        avatarPath column: 'avatar_path'
        resetToken column: 'reset_token'
        resetTokenExpiry column: 'reset_token_expiry'
        bio type: 'text'
    }
}
