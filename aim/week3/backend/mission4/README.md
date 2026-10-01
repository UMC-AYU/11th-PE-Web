# Mission4 - 신규 도서 대여 기록 생성 API

## API
POST /rentals

## 설명
Request Body로 userId와 bookId를 전달받아 rental 테이블에 신규 도서 대여 기록을 생성하는 API입니다.

## 요청 예시
POST http://localhost:8080/rentals

## Request Body
```json
{
  "userId": 1,
  "bookId": 1
}
```

## 핵심 코드
- RentalController
- RentalService
- RentalRepository

## 구현 내용
- @RequestBody로 userId, bookId 전달
- Repository에서 Raw SQL 작성
- JdbcTemplate.update()로 INSERT 실행
- rented_at은 NOW()로 현재 시간 저장
- due_at은 DATE_ADD(NOW(), INTERVAL 7 DAY)로 7일 뒤 날짜 저장
- userId, bookId는 파라미터 바인딩으로 안전하게 전달