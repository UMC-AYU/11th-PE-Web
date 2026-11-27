-- 회원가입 API는 6주차에 만들기 때문에 테스트용 데이터를 직접 넣습니다.
-- password는 bcrypt 해시 길이(60자)에 맞춘 더미 값이며 실제 로그인에는 쓰지 않습니다.
USE umcine;

INSERT INTO member (email, password, nickname) VALUES
    ('yosi@umc.com',  '$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyha', 'yosi'),
    ('movie@umc.com', '$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyha', '영화광'),
    ('empty@umc.com', '$2b$10$dummyhashdummyhashdummyhashdummyhashdummyhashdummyha', '평점없음');

-- movie_id는 TMDB 영화 ID입니다. (550 파이트 클럽, 155 다크 나이트, 27205 인셉션, 157336 인터스텔라, 496243 기생충)
INSERT INTO rating (member_id, movie_id, score, comment) VALUES
    (1, 550,    5, '다시 봐도 반전이 놀라워요.'),
    (1, 27205,  4, '꿈 속의 꿈 설정이 재밌어요.'),
    (1, 496243, 5, NULL),
    (2, 155,    5, '조커 연기가 최고예요.'),
    (2, 157336, 4, '음악과 영상미가 압도적이에요.');
