UPDATE members
SET privileges='moderator'
WHERE username=? LIMIT 1;
