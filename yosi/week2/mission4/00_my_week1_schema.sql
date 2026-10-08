-- 1주차 ERD (실제 버전) - 지역 기반 미션 리워드 서비스
-- 참고: 00_my_week1_erd.md
-- 기존 yosi/week1/mission3/schema.sql은 그대로 두고, 실제 다이어그램 기준으로 새로 작성함

CREATE TABLE food_category (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,   -- 카테고리명 예: 한식, 중식, 일식 등
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE region (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,   -- 지역명 예: 강남구, 서초구 등
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE store (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    region_id          BIGINT NOT NULL,
    food_category_id   BIGINT NOT NULL,
    name               VARCHAR(100) NOT NULL,   -- 가게명
    address            VARCHAR(255) NOT NULL,
    phone_number       VARCHAR(20),             -- nullable
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_store_region
        FOREIGN KEY (region_id) REFERENCES region (id),
    CONSTRAINT fk_store_food_category
        FOREIGN KEY (food_category_id) REFERENCES food_category (id)
);

CREATE TABLE member (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255),           -- 해쉬화, 소셜 로그인만 사용 시 nullable
    password      VARCHAR(255),           -- 일반 로그인 사용 시, nullable
    name          VARCHAR(50) NOT NULL,   -- 회원이름
    phone_number  VARCHAR(20),
    social_type   VARCHAR(20),            -- 소셜로그인 타입: KAKAO, NAVER, APPLE 등
    social_id     VARCHAR(255),           -- 소셜로그인 식별자
    point         INT NOT NULL DEFAULT 0, -- 보유 포인트
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME NULL           -- 소프트 delete
);

CREATE TABLE mission (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id       BIGINT NOT NULL,        -- 관련 가게 id
    title          VARCHAR(100) NOT NULL,  -- 미션 제목
    description    TEXT,                   -- 미션 설명, nullable
    reward_point   INT NOT NULL DEFAULT 0, -- 보상 포인트
    deadline       DATETIME NULL,          -- 마감 일시, nullable
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mission_store
        FOREIGN KEY (store_id) REFERENCES store (id)
);

CREATE TABLE member_preference (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id          BIGINT NOT NULL,   -- 회원 id
    food_category_id   BIGINT NOT NULL,   -- 선호 음식 카테고리 id
    region_id          BIGINT NULL,       -- 선호 지역 id, nullable
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_preference_member
        FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_member_preference_food_category
        FOREIGN KEY (food_category_id) REFERENCES food_category (id),
    CONSTRAINT fk_member_preference_region
        FOREIGN KEY (region_id) REFERENCES region (id)
);

CREATE TABLE member_mission (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id     BIGINT NOT NULL,     -- 회원 id
    mission_id    BIGINT NOT NULL,     -- 미션 id
    status        VARCHAR(20) NOT NULL DEFAULT 'CHALLENGING', -- CHALLENGING, COMPLETE
    completed_at  DATETIME NULL,       -- 완료 일시, nullable
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_mission_member
        FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_member_mission_mission
        FOREIGN KEY (mission_id) REFERENCES mission (id)
);

CREATE TABLE member_region_mission_count (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id    BIGINT NOT NULL,          -- 회원 id
    region_id    BIGINT NOT NULL,          -- 지역 id
    clear_count  INT NOT NULL DEFAULT 0,   -- 해당 지역 클리어 미션 수
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_region_mission_count_member
        FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_member_region_mission_count_region
        FOREIGN KEY (region_id) REFERENCES region (id)
);

CREATE TABLE review (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT NOT NULL,   -- 작성자 id
    store_id            BIGINT NOT NULL,   -- 가게 id
    member_mission_id   BIGINT NULL,       -- 관련 수행미션 id, nullable
    rating              FLOAT NOT NULL,    -- 평점
    content             TEXT NOT NULL,     -- 리뷰 내용
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME NULL,     -- 소프트 delete
    CONSTRAINT fk_review_member
        FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_review_store
        FOREIGN KEY (store_id) REFERENCES store (id),
    CONSTRAINT fk_review_member_mission
        FOREIGN KEY (member_mission_id) REFERENCES member_mission (id)
);
