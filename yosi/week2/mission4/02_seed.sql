-- 책·카테고리·대여·태그·좋아요·알림 더미 데이터

INSERT INTO users (nickname) VALUES
    ('민서'), ('수현'), ('yosi');

INSERT INTO category (name) VALUES
    ('문학'), ('IT'), ('에세이');

INSERT INTO book (category_id, title, description, is_available, created_at) VALUES
    (1, '데미안', '헤르만 헤세의 성장 소설', FALSE, '2026-09-01 10:00:00'),          -- 대여 중 (user 2)
    (1, '난쟁이가 쏘아올린 작은 공', '조세희의 연작 소설', FALSE, '2026-09-05 10:00:00'), -- 대여 중 (user 1)
    (1, '소년이 온다', '한강의 장편 소설', TRUE, '2026-09-10 10:00:00'),            -- 대여 가능
    (2, '클린 코드', '로버트 마틴의 소프트웨어 장인 정신', TRUE, '2026-08-20 10:00:00'), -- 반납 완료
    (3, '언어의 온도', '이기주의 에세이', FALSE, '2026-08-25 10:00:00');            -- 대여 중 (user 3)

INSERT INTO tag (name) VALUES
    ('고전'), ('성장'), ('한국문학'), ('입문서');

INSERT INTO book_tag (book_id, tag_id) VALUES
    (1, 1), (1, 2),
    (2, 3),
    (3, 3), (3, 2);

INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) VALUES
    (1, 2, '2026-09-08 09:00:00', '2026-09-15 09:00:00', NULL),
    (1, 4, '2026-09-01 09:00:00', '2026-09-08 09:00:00', '2026-09-07 12:00:00'),
    (2, 1, '2026-09-10 09:00:00', '2026-09-17 09:00:00', NULL),
    (3, 5, '2026-09-12 09:00:00', '2026-09-19 09:00:00', NULL);

INSERT INTO book_like (user_id, book_id) VALUES
    (1, 1), (1, 3),
    (2, 1),
    (3, 4);

INSERT INTO notification (user_id, message, is_read) VALUES
    (1, '대여하신 책의 반납일이 다가와요.', FALSE),
    (2, '찜한 책이 대여 가능해졌어요.', TRUE);
