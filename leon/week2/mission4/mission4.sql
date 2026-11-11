SELECT
    b.title,
    r.rented_at,
    r.due_at
FROM rent r
JOIN book b
    ON r.book_id = b.book_id
WHERE r.member_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;