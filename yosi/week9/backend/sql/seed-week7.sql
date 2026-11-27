-- 7주차 로그인 실습용: 5주차 seed 회원은 더미 해시라 로그인할 수 없어서
-- 비밀번호를 'Umc1234!'의 bcrypt 해시로 바꿉니다.
USE umcine;

UPDATE member
SET password = '$2b$10$6xIK3/E8715iTLUJT2gRfeFaTmH/2ZNgeY23zyIT1nnVbAIESUTAy'
WHERE email IN ('yosi@umc.com', 'movie@umc.com', 'empty@umc.com');
