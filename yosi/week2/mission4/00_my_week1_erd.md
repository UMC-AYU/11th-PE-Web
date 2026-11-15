# 1주차 ERD (실제 버전) - 지역 기반 미션 리워드 서비스

기존 `yosi/week1/mission3/erd.md`와 도메인은 같지만, 실제로 다이어그램 툴로 그린 버전은
테이블/컬럼 이름이 달라서 이 폴더 안에 별도로 다시 정리했어요.
(PK는 모든 테이블에서 `id`, FK는 `<참조 테이블 단수형>_id` 규칙)

## 테이블 목록

| 테이블 | 설명 |
|---|---|
| `food_category` | 음식 카테고리 (한식, 중식, 일식 등) |
| `region` | 지역 (강남구, 서초구 등) |
| `store` | 가게 정보 (지역 + 음식 카테고리에 속함) |
| `member` | 회원 정보 (일반/소셜 로그인, 보유 포인트, 소프트 삭제) |
| `mission` | 가게에 속한 미션 (보상 포인트, 마감 일시) |
| `member_preference` | 회원의 선호 음식 카테고리·지역 |
| `member_mission` | 회원별 미션 수행 이력 (상태: `CHALLENGING`, `COMPLETE`) |
| `member_region_mission_count` | 회원이 지역별로 클리어한 미션 수 |
| `review` | 회원이 가게에 남긴 리뷰 (특정 수행 미션과 연결 가능) |

## 관계

- `food_category` 1:N `store`
- `food_category` 1:N `member_preference`
- `region` 1:N `store`
- `region` 1:N `member_preference`
- `region` 1:N `member_region_mission_count`
- `store` 1:N `mission`
- `store` 1:N `review`
- `member` 1:N `member_preference`
- `member` 1:N `member_mission`
- `member` 1:N `member_region_mission_count`
- `member` 1:N `review`
- `mission` 1:N `member_mission`
- `member_mission` 1:N `review` (미션 완료 후 남기는 리뷰, nullable)
