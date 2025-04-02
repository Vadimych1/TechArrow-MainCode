INSERT INTO users (name, email, age, phone, password, salt)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (email) DO NOTHING
RETURNING id;