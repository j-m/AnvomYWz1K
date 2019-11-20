SELECT
rating,
COUNT(*) as count
FROM reviews
WHERE game=?
AND type=?
GROUP BY rating;
