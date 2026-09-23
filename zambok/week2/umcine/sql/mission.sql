USE umc_week2;

-- ========================================
-- 미션 1
-- 문학 카테고리의 대여 가능한 도서 최신순 10개
-- ========================================

SELECT
    b.title,
    b.description,
    c.name AS category_name
FROM book b
JOIN category c
    ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;


-- ========================================
-- 미션 2
-- 특정 사용자가 아직 반납하지 않은 책 조회
-- user_id = 1
-- ========================================

SELECT
    b.title,
    r.rented_at,
    r.due_at
FROM rental r
JOIN book b
    ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;


-- ========================================
-- 미션 3
-- 특정 책의 태그와 특정 사용자의 좋아요 여부
-- book_id = 1, user_id = 1
-- ========================================

SELECT
    b.title,
    t.name AS tag_name,
    CASE
        WHEN bl.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_liked
FROM book b
LEFT JOIN book_tag bt
    ON b.book_id = bt.book_id
LEFT JOIN tag t
    ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl
    ON b.book_id = bl.book_id
   AND bl.user_id = 1
WHERE b.book_id = 1;


-- ========================================
-- 확장 미션
-- 1주차에 직접 설계한 ERD 기준
-- 특정 지역의 미션 목록과 가게 정보 조회
-- ========================================

SELECT
    m.title AS mission_title,
    m.content AS mission_content,
    s.name AS store_name,
    r.name AS region_name
FROM mission m
JOIN store s
    ON m.store_id = s.id
JOIN region r
    ON s.region_id = r.id
WHERE r.id = 1
  AND m.deleted_at IS NULL
  AND s.deleted_at IS NULL
ORDER BY m.id DESC;