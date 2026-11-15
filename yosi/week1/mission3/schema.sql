-- 지역 기반 미션 리워드 서비스 ERD
-- 참고: erd.md (Mermaid ERD)

CREATE TABLE member (
    member_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255),
    nickname      VARCHAR(50)  NOT NULL,
    gender        VARCHAR(10),   -- M, F, NONE
    birth_date    DATE,
    address       VARCHAR(255),
    total_point   INT NOT NULL DEFAULT 0,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE member_social (
    member_social_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id         BIGINT NOT NULL,
    provider          VARCHAR(20) NOT NULL,   -- KAKAO, GOOGLE, APPLE 등
    provider_user_id  VARCHAR(255) NOT NULL,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_social_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT uq_member_social_provider
        UNIQUE (provider, provider_user_id)
);

CREATE TABLE region (
    region_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    sido        VARCHAR(50),
    sigungu     VARCHAR(50)
);

CREATE TABLE food_category (
    food_category_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(50) NOT NULL
);

CREATE TABLE member_food_preference (
    member_food_preference_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                  BIGINT NOT NULL,
    food_category_id           BIGINT NOT NULL,
    created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_food_preference_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_member_food_preference_food_category
        FOREIGN KEY (food_category_id) REFERENCES food_category (food_category_id),
    CONSTRAINT uq_member_food_preference
        UNIQUE (member_id, food_category_id)
);

CREATE TABLE store (
    store_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    region_id         BIGINT NOT NULL,
    food_category_id  BIGINT NOT NULL,
    name              VARCHAR(100) NOT NULL,
    address           VARCHAR(255),
    phone             VARCHAR(20),
    description       VARCHAR(500),
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_store_region
        FOREIGN KEY (region_id) REFERENCES region (region_id),
    CONSTRAINT fk_store_food_category
        FOREIGN KEY (food_category_id) REFERENCES food_category (food_category_id)
);

CREATE TABLE mission (
    mission_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id       BIGINT NOT NULL,
    title          VARCHAR(100) NOT NULL,
    description    VARCHAR(500),
    reward_point   INT NOT NULL DEFAULT 0,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mission_store
        FOREIGN KEY (store_id) REFERENCES store (store_id)
);

CREATE TABLE member_mission (
    member_mission_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id          BIGINT NOT NULL,
    mission_id         BIGINT NOT NULL,
    status             VARCHAR(20) NOT NULL DEFAULT 'READY', -- READY, IN_PROGRESS, COMPLETED
    completed_at       DATETIME,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_mission_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_member_mission_mission
        FOREIGN KEY (mission_id) REFERENCES mission (mission_id),
    CONSTRAINT uq_member_mission
        UNIQUE (member_id, mission_id)
);

CREATE TABLE review (
    review_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT NOT NULL,
    store_id             BIGINT NOT NULL,
    member_mission_id    BIGINT NOT NULL,
    rating               TINYINT NOT NULL, -- 1~5
    content              VARCHAR(1000),
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_review_store
        FOREIGN KEY (store_id) REFERENCES store (store_id),
    CONSTRAINT fk_review_member_mission
        FOREIGN KEY (member_mission_id) REFERENCES member_mission (member_mission_id),
    CONSTRAINT uq_review_member_mission
        UNIQUE (member_mission_id),
    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE member_region_point (
    member_region_point_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                BIGINT NOT NULL,
    region_id                BIGINT NOT NULL,
    cleared_mission_count    INT NOT NULL DEFAULT 0,
    bonus_point_earned       INT NOT NULL DEFAULT 0,
    is_bonus_awarded         BOOLEAN NOT NULL DEFAULT FALSE, -- 10개 클리어 시 1000P 지급 여부
    bonus_awarded_at         DATETIME,
    CONSTRAINT fk_member_region_point_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_member_region_point_region
        FOREIGN KEY (region_id) REFERENCES region (region_id),
    CONSTRAINT uq_member_region_point
        UNIQUE (member_id, region_id)
);
