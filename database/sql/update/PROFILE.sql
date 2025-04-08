UPDATE users
SET name = $1,
email = $2,
age = $3,
phone = $4
WHERE id = $5;