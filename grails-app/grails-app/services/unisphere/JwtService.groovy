package unisphere

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import java.security.Key
import java.util.Date
import org.springframework.stereotype.Service
import grails.core.support.GrailsConfigurationAware
import grails.config.Config
import javax.annotation.PostConstruct

@Service
class JwtService implements GrailsConfigurationAware {
    private String secret = "UniSphereSuperSecretKeyForDevelopmentOnly1234567890!"
    private Key key
    private static final long EXPIRATION_TIME = 86400000L // 24 hours

    @Override
    void setConfiguration(Config config) {
        String configuredSecret = config.getProperty('unisphere.jwt.secret', String)
        if (configuredSecret) {
            this.secret = configuredSecret
        }
    }

    @PostConstruct
    void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes("UTF-8"))
    }

    String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact()
    }

    String extractEmail(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
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
