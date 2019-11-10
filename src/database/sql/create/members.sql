CREATE TABLE IF NOT EXISTS members (
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT 0 CHECK (email_verified IN (0,1)),
  name TEXT, 
  joined DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  nudity BOOLEAN NOT NULL DEFAULT 0 CHECK (nudity IN (0,1)),
  profanity BOOLEAN NOT NULL DEFAULT 0 CHECK (profanity IN (0,1)),
  PRIMARY KEY(username)
) WITHOUT ROWID;
