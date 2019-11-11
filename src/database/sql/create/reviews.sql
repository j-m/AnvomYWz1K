CREATE TABLE IF NOT EXISTS reviews (
  game TEXT NOT NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY(game, author)
  FOREIGN KEY(game) REFERENCES games(id),
  FOREIGN KEY(author) REFERENCES members(id)
) WITHOUT ROWID;
