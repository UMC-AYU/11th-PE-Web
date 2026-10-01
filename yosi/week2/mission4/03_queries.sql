-- ================================================================
-- 쿼리 작성 전 체크리스트 (모든 쿼리에 공통 적용)
--   - 화면에 쓰지 않는 컬럼까지 SELECT * 로 가져오지 않았는가?
--   - JOIN한 테이블마다 PK/FK 관계에 맞는 ON 조건을 적었는가?
--   - 현재 사용자, 카테고리, 대여 가능 상태처럼 빠지면 안 되는 조건을
--     WHERE에 넣었는가?
--   - 목록이라면 일관된 정렬 기준과(필요 시) LIMIT이 있는가?
--   - 더미 데이터에서 결과가 0건일 때도 그 이유를 설명할 수 있는가?
--   생각 순서: FROM -> JOIN -> WHERE -> SELECT -> ORDER BY -> LIMIT
-- ================================================================


-- ================================================================
-- 2-1. 카테고리별 대여 가능 도서 목록
--   요구사항: "문학 카테고리에서 대여 가능한 도서를 최신순으로 10권 보여 준다."
--   - 결과: 책 제목, 설명, 카테고리 이름
--   - 테이블: book, category / 관계: book -> category
--   - 생각 순서(FROM -> JOIN -> WHERE -> SELECT -> ORDER BY -> LIMIT)
--     1) FROM book: 조회 대상(책)이 중심이므로 기준 테이블로 삼는다.
--     2) JOIN category: 카테고리 이름이 category 테이블에만 있고
--        book에는 category_id(FK)만 있으므로, book.category_id =
--        category.category_id로 연결한다.
--     3) WHERE: category.name = '문학'으로 카테고리를 좁히고,
--        book.is_available = TRUE로 "대여 가능 상태"만 남긴다.
--     4) SELECT: 화면에 쓰는 책 제목, 설명, 카테고리 이름만 가져온다
--        (SELECT * 로 불필요한 컬럼까지 가져오지 않는다).
--     5) ORDER BY book_id DESC: 최신순 = book_id가 큰 것부터.
--     6) LIMIT 10: "10권"이라는 범위 제한.
-- ================================================================
SELECT
    b.title,
    b.description,
    c.name AS category_name
FROM book b
JOIN category c
    ON c.category_id = b.category_id
WHERE c.name = '문학'
    AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;


-- ================================================================
-- 2-2. 내가 대여 중인 책
--   요구사항: "로그인한 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로
--             보여 준다."
--   - 결과: 책 제목, 대여일, 반납 예정일
--   - 테이블: rental, book / 관계: rental -> book
--   - 생각 순서(FROM -> JOIN -> WHERE -> SELECT -> ORDER BY -> LIMIT)
--     1) FROM rental: "대여 중인 것"을 판단하는 기준이 rental 테이블의
--        returned_at이므로 rental을 기준 테이블로 삼는다.
--     2) JOIN book: 책 제목이 rental에는 없고 book에만 있으므로
--        rental.book_id = book.book_id로 연결한다.
--     3) WHERE: 현재 로그인한 사용자(user_id)로 좁히고,
--        returned_at IS NULL로 "아직 반납하지 않은" 대여만 남긴다.
--     4) SELECT: 화면에 쓰는 책 제목, 대여일(rented_at), 반납 예정일(due_at).
--     5) ORDER BY due_at ASC: 반납 예정일이 임박한 순.
--     6) LIMIT 없음: 목록 전체를 보여줘야 하는 화면이라 범위 제한이 없다.
-- ================================================================
SELECT
    b.title,
    r.rented_at,
    r.due_at
FROM rental r
JOIN book b
    ON b.book_id = r.book_id
WHERE r.user_id = 1          -- 현재 로그인한 사용자 예시: user_id = 1
    AND r.returned_at IS NULL
ORDER BY r.due_at ASC;


-- ================================================================
-- 2-3. 도서 상세의 태그와 좋아요 여부
--   요구사항: "책 상세 화면에서 태그 목록과 현재 사용자의 좋아요 여부를
--             함께 확인한다."
--   - 결과: 책 제목, 태그 이름, 좋아요 여부
--   - 테이블: book, book_tag, tag, book_like
--   - 관계: book -> book_tag -> tag / book -> book_like
--   - 생각 순서(FROM -> JOIN -> WHERE -> SELECT -> ORDER BY -> LIMIT)
--     1) FROM book: 조회 대상이 "책 한 권의 상세 정보"이므로 기준 테이블.
--     2) JOIN book_tag, tag: 태그 이름은 tag에만 있고, book과 tag는
--        N:M이라 중간 테이블 book_tag를 거쳐 book.book_id = book_tag.book_id,
--        book_tag.tag_id = tag.tag_id로 연결한다.
--     3) WHERE: 상세 화면에서 보고 있는 책 하나로 book_id를 좁힌다.
--     4) SELECT: 화면에 쓰는 책 제목, 태그 이름과, book_like에 (현재
--        사용자, 이 책) 조합이 있는지를 EXISTS 서브쿼리로 판단한
--        좋아요 여부(is_liked)를 가져온다.
--     5) ORDER BY / LIMIT: 태그 이름 목록이므로 tag_name ASC로만 정렬하고,
--        상세 화면 전체 태그를 보여줘야 하므로 LIMIT은 두지 않는다.
-- ================================================================
SELECT
    b.title,
    t.name AS tag_name,
    EXISTS (
        SELECT 1
        FROM book_like bl
        WHERE bl.book_id = b.book_id
            AND bl.user_id = 1     -- 현재 로그인한 사용자 예시: user_id = 1
    ) AS is_liked
FROM book b
JOIN book_tag bt
    ON bt.book_id = b.book_id
JOIN tag t
    ON t.tag_id = bt.tag_id
WHERE b.book_id = 1                -- 선택한 책 예시: book_id = 1
ORDER BY t.name ASC;


-- ================================================================
-- 확장. 1주차 ERD(지역 기반 미션 리워드 서비스)로 화면 요구사항 1개 확장
--   요구사항: "특정 회원이 특정 지역에서 완료한 미션 이력을 최근 완료순으로
--             조회한다. 결과에는 가게 이름, 미션 제목, 리워드 포인트,
--             완료 일시를 포함한다." (와이어프레임의 "완료한 미션" 탭에 대응)
--   - 기준 테이블: member_mission (회원별 미션 수행 이력의 중심 테이블)
--   - JOIN: mission을 JOIN한 이유는 미션 제목/리워드 포인트가 mission에
--     있기 때문이고, store를 JOIN한 이유는 가게 이름을 store에서 가져와야
--     하기 때문이다. region을 JOIN한 이유는 "특정 지역"을 지역 이름으로
--     지정하려면 region.name이 필요하기 때문이다.
--     (JOIN 경로: member_mission -> mission -> store -> region)
--   - WHERE: member_id로 특정 회원, status = 'COMPLETE'로 완료된 미션만,
--     region.name으로 특정 지역만 좁혔다.
--   - 정렬: "최근 완료순"이므로 completed_at DESC.
-- ================================================================
SELECT
    s.name AS store_name,
    ms.title AS mission_title,
    ms.reward_point,
    mm.completed_at
FROM member_mission mm
JOIN mission ms
    ON ms.id = mm.mission_id
JOIN store s
    ON s.id = ms.store_id
JOIN region r
    ON r.id = s.region_id
WHERE mm.member_id = 1             -- 특정 회원 예시: member_id = 1
    AND mm.status = 'COMPLETE'
    AND r.name = '강남구'          -- 특정 지역 예시: region.name = '강남구'
ORDER BY mm.completed_at DESC;
