CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  title TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  publisher TEXT NOT NULL,
  description TEXT,
  store TEXT,
  tags TEXT,
  released DATETIME
) WITHOUT ROWID;
