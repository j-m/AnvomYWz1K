CREATE TABLE IF NOT EXISTS reviews (
  game TEXT NOT NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'short' CHECK (type IN ('short','long')), 
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(game, author)
  FOREIGN KEY(game) REFERENCES games(id),
  FOREIGN KEY(author) REFERENCES members(username)
) WITHOUT ROWID;
