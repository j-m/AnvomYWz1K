CREATE TABLE IF NOT EXISTS reviews (
  game TEXT NOT NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'short' CHECK (type IN ('short','long')), 
  posted DATETIME DEFAULT CURRENT_TIMESTAMP,
  visibility TEXT DEFAULT 'moderator' CHECK (visibility IN ('public','moderator','author')), 
  PRIMARY KEY(game, author, type),
  FOREIGN KEY(game) REFERENCES games(id),
  FOREIGN KEY(author) REFERENCES members(username)
) WITHOUT ROWID;
