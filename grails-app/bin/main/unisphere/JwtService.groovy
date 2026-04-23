package unisphere

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import java.security.Key
import java.util.Date
import org.springframework.stereotype.Service

@Service
class JwtService {
    // In production, load this from external config! We use a static key for dev.
    private static final String SECRET = "UniSphereSuperSecretKeyForDevelopmentOnly1234567890!"
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes("UTF-8"))
    private static final long EXPIRATION_TIME = 86400000L // 24 hours

    String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact()
    }

    String extractEmail(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject()
        } catch (Exception e) {
            log.error("JWT Validation failed: ${e.message}")
            return null
        }
    }
}
