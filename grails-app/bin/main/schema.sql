CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    branch VARCHAR(255),
    semester INT,
    bio TEXT,
    avatar_path VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    date_created TIMESTAMP NOT NULL,
    last_updated TIMESTAMP NOT NULL
);

CREATE TABLE posts (
    id VARCHAR(100) PRIMARY KEY,
    post_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP,
    author VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    likes INT NOT NULL DEFAULT 0,
    date_created TIMESTAMP NOT NULL,
    last_updated TIMESTAMP NOT NULL
);

CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version BIGINT NOT NULL,
    post_id VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    date_created TIMESTAMP NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    version BIGINT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    message VARCHAR(1000),
    type VARCHAR(50),
    is_read BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    date_created TIMESTAMP NOT NULL,
    last_updated TIMESTAMP NOT NULL
);
