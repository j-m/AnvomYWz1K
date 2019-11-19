SELECT
COUNT(*) as count
FROM reviews
WHERE game=?
AND type='short'
GROUP BY rating;
