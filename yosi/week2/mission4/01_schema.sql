-- 온라인 도서 대여 관리 시스템 기준 ERD
-- 관계: users 1:N rental, category 1:N book, book N:M tag(book_tag),
--       users N:M book(book_like), users 1:N notification
-- 주의: 실제 제공 파일을 받으면 컬럼명을 대조해 맞춰주세요.

CREATE TABLE users (
    user_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nickname    VARCHAR(50) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
    category_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(50) NOT NULL
);

CREATE TABLE book (
    book_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id   BIGINT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   VARCHAR(500),
    is_available  BOOLEAN NOT NULL DEFAULT TRUE,  -- 대여 가능 상태
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_category
        FOREIGN KEY (category_id) REFERENCES category (category_id)
);

CREATE TABLE rental (
    rental_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    book_id      BIGINT NOT NULL,
    rented_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at       DATETIME NOT NULL,
    returned_at  DATETIME NULL,
    CONSTRAINT fk_rental_user
        FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_rental_book
        FOREIGN KEY (book_id) REFERENCES book (book_id)
);

CREATE TABLE tag (
    tag_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(50) NOT NULL
);

CREATE TABLE book_tag (
    book_id  BIGINT NOT NULL,
    tag_id   BIGINT NOT NULL,
    PRIMARY KEY (book_id, tag_id),
    CONSTRAINT fk_book_tag_book
        FOREIGN KEY (book_id) REFERENCES book (book_id),
    CONSTRAINT fk_book_tag_tag
        FOREIGN KEY (tag_id) REFERENCES tag (tag_id)
);

CREATE TABLE book_like (
    user_id     BIGINT NOT NULL,
    book_id     BIGINT NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    CONSTRAINT fk_book_like_user
        FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_book_like_book
        FOREIGN KEY (book_id) REFERENCES book (book_id)
);

CREATE TABLE notification (
    notification_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    message           VARCHAR(300) NOT NULL,
    is_read           BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
);
