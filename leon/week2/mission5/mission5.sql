SELECT
    b.title,
    h.title AS hashtag,
    CASE
        WHEN bl.book_like_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_liked
FROM book b
LEFT JOIN book_hashtag bh
    ON b.book_id = bh.book_id
LEFT JOIN hashtag h
    ON bh.hashtag_id2 = h.hashtag_id
LEFT JOIN book_like bl
    ON b.book_id = bl.book_id
    AND bl.member_id = 1
WHERE b.book_id = 1
ORDER BY h.hashtag_id ASC;