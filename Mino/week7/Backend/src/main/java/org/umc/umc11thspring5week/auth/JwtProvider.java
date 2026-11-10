package org.umc.umc11thspring5week.auth;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.umc.umc11thspring5week.exception.BusinessException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import static org.umc.umc11thspring5week.exception.ErrorCode.EXPIRED_TOKEN;
import static org.umc.umc11thspring5week.exception.ErrorCode.INVALID_TOKEN;

@Component
public class JwtProvider {

    private final SecretKey key;
    private final JwtParser parser;
    private final long accessExpiration;

    public JwtProvider(@Value("${jwt.secret}") String secret,
                       @Value("${jwt.access-expiration}") long accessExpiration) {
        if (accessExpiration <= 0) {
            throw new IllegalArgumentException("JWT_ACCESS_EXPIRATION must be positive");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.parser = Jwts.parser().verifyWith(key).build();
        this.accessExpiration = accessExpiration;
    }

    public String issue(Long memberId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(memberId.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessExpiration)))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public Long parseMemberId(String token) {
        try {
            Claims claims = parser.parseSignedClaims(token).getPayload();
            long memberId = Long.parseLong(claims.getSubject());
            if (claims.getExpiration() == null || memberId <= 0) {
                throw new BusinessException(INVALID_TOKEN);
            }
            return memberId;
        } catch (ExpiredJwtException exception) {
            throw new BusinessException(EXPIRED_TOKEN);
        } catch (JwtException | IllegalArgumentException exception) {
            throw new BusinessException(INVALID_TOKEN);
        }
    }
}
