CREATE TABLE IF NOT EXISTS members (
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT 0 CHECK (email_verified IN (0,1)),
  name TEXT, 
  joined DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  hide_nudity BOOLEAN NOT NULL DEFAULT 1 CHECK (hide_nudity IN (0,1)),
  hide_profanity BOOLEAN NOT NULL DEFAULT 1 CHECK (hide_profanity IN (0,1)),
  privileges TEXT NOT NULL DEFAULT 'none' CHECK (privileges IN ('none', 'moderator', 'administrator')),
  PRIMARY KEY(username)
) WITHOUT ROWID;
