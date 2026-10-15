# Mission3 - 특정 카테고리 도서 목록 조회 API

## API
GET /books/category/{categoryId}

## 설명
Path Variable로 categoryId를 전달받아 해당 카테고리에 속한 도서 목록을 조회하는 API입니다.

## 요청 예시
GET http://localhost:8080/books/category/1

## 핵심 SQL
```sql
SELECT *
FROM book
WHERE category_id = ?;
```

## 핵심 코드
- BookController
- BookService
- BookRepository

## 구현 내용
- @PathVariable로 categoryId 전달
- Repository에서 Raw SQL 작성
- JdbcTemplate.queryForList()로 조회
- 파라미터 바인딩을 사용해 categoryId를 안전하게 전달
- 
## 프로젝트 위치

[Spring Boot 프로젝트](./11th_study)

미션3과 미션4는 하나의 Spring Boot 프로젝트에 구현되어 있습니다.
미션3 관련 코드는 BookController, BookService, BookRepository입니다.