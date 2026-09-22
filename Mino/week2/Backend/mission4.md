```sql
SET @region_id = 1;

SELECT
s.name AS store_name,
s.introduction,
s.address,
s.average_rating,
s.review_count,
r.name AS region_name,
fc.name AS food_category_name
FROM store s
JOIN region r
ON s.region_id = r.region_id
JOIN food_category fc
ON s.food_category_id = fc.food_category_id
WHERE s.region_id = @region_id
AND s.store_status = 'OPEN'
AND s.deleted_at IS NULL
AND fc.is_active = TRUE
ORDER BY s.average_rating DESC, s.review_count DESC, s.store_id DESC
LIMIT 10;
```

### 설명

- 기준 테이블: `store`
- JOIN한 이유: 가게가 속한 지역 이름을 가져오기 위해 `region`을 조인하고, 음식 카테고리 이름을 가져오기 위해 `food_category`를 조인했다.
- WHERE 조건: 특정 지역의 가게만 조회하고, `store_status = 'OPEN'`으로 영업 중인 가게만 조회한다. 삭제된 가게와 비활성화된 음식 카테고리는 제외한다.
- 정렬·목록 기준: 평점 높은 순, 리뷰 많은 순, 최신 가게 순으로 정렬하고 10개만 조회한다.
- JOIN 경로: `store.region_id -> region.region_id`, `store.food_category_id -> food_category.food_category_id`