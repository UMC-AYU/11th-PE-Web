-- Check for existing duplicates first. Resolve them before applying ALTER TABLE.
SELECT member_id, movie_id, COUNT(*) AS rating_count
FROM rating GROUP BY member_id, movie_id HAVING COUNT(*) > 1;

ALTER TABLE rating ADD CONSTRAINT UQ_rating_member_movie UNIQUE (member_id, movie_id);
