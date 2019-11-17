CREATE TABLE IF NOT EXISTS games (
  id TEXT UNIQUE NOT NULL,
  steamAppID TEXT UNIQUE NOT NULL,
  title TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  developer TEXT,
  publisher TEXT,
  description TEXT,
  store TEXT,
  tags TEXT,
  releaseDate DATETIME,
  PRIMARY KEY(id)
) WITHOUT ROWID;
