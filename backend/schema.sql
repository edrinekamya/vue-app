CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friends (
    userId INTEGER,
    friendId INTEGER,
    id AS (CASE WHEN userId < friendId THEN userId || '_' || friendId ELSE friendId || '_' || userId END),
    status TEXT CHECK( status IN ('REQUEST','FRIEND') ) NOT NULL DEFAULT 'REQUEST',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, friendId),
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (friendId) REFERENCES users (id) ON DELETE CASCADE,
    CHECK (userId != friendId),
    CONSTRAINT test_unique UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    channelId INTEGER, 
    chatId INTEGER,
    message TEXT NOT NULL,
    type TEXT CHECK( type IN ('TEXT','IMAGE','FILE', 'VIDEO-CALL', 'REQUEST', 'VOICE-CALL') ) NOT NULL DEFAULT 'TEXT',
    status TEXT CHECK (status IN ('PENDING', 'SENT', 'RECEIVED', 'READ', 'REJECTED', 'MISSED', 'SUCCESSFUL')) NOT NULL DEFAULT 'PENDING',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (chatId) REFERENCES friends (id) ON DELETE CASCADE
);

