CREATE TABLE IF NOT EXISTS games (
  id TEXT UNIQUE NOT NULL,
  title TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  publisher TEXT NOT NULL,
  description TEXT,
  store TEXT,
  steamAppID TEXT,
  tags TEXT,
  releaseDate DATETIME,
  PRIMARY KEY(id)
) WITHOUT ROWID;
