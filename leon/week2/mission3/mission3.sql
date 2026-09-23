SELECT
    b.title,
    b.description,
    c.name AS category_name
FROM book b
JOIN category c
    ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND NOT EXISTS (
      SELECT 1
      FROM rent r
      WHERE r.book_id = b.book_id
        AND r.returned_at IS NULL
  )
ORDER BY b.created_at DESC
LIMIT 10;