CREATE TABLE IF NOT EXISTS comments (
  review_game TEXT NOT NULL,
  review_author TEXT NOT NULL,
  review_type TEXT NOT NULL, 
  
  id TEXT NOT NULL,
  author TEXT NOT NULL,
  posted DATETIME DEFAULT CURRENT_TIMESTAMP,
  message TEXT NOT NULL,
  
  PRIMARY KEY(id),
  FOREIGN KEY(review_game) REFERENCES reviews(game)
  FOREIGN KEY(review_author) REFERENCES reviews(author)
  FOREIGN KEY(review_type) REFERENCES reviews(type)
  FOREIGN KEY(author) REFERENCES members(username)
) WITHOUT ROWID;
