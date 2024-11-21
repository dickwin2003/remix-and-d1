CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    deleted INTEGER DEFAULT 0,
    settings TEXT DEFAULT '{}'
);

-- Insert some sample data
INSERT INTO users (email_address) VALUES 
    ('user1@example.com'),
    ('user2@example.com'),
    ('user3@example.com'),
    ('user4@example.com'),
    ('user5@example.com');
