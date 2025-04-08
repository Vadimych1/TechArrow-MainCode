CREATE TABLE IF NOT EXISTS "users" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INTEGER,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) DEFAULT generate_random_varchar() NOT NULL,
    expires TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    stars INTEGER NOT NULL
);