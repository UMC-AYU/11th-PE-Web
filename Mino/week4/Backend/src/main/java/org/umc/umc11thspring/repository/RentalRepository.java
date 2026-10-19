package org.umc.umc11thspring.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public Long save(Long userId, Long bookId) {
        String sql = """
                INSERT INTO rental (user_id, book_id, rented_at, due_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, userId);
            statement.setLong(2, bookId);
            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        if (generatedId == null) {
            throw new IllegalStateException("생성된 대여 기록 ID를 확인할 수 없습니다.");
        }
        return generatedId.longValue();
    }

    public Optional<Map<String, Object>> findById(Long rentalId) {
        String sql = """
                SELECT rental_id AS rentalId,
                       user_id AS userId,
                       book_id AS bookId,
                       rented_at AS rentedAt,
                       due_at AS dueAt,
                       returned_at AS returnedAt
                FROM rental
                WHERE rental_id = ?
                """;

        return jdbcTemplate.queryForList(sql, rentalId).stream().findFirst();
    }

    public int returnBook(Long rentalId) {
        String sql = "UPDATE rental SET returned_at = NOW() WHERE rental_id = ?";
        return jdbcTemplate.update(sql, rentalId);
    }
}
