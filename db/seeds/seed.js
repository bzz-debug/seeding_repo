const db = require("../connection");
const format = require("pg-format");
//topics
//USERS
//articles
//comments

//users - unlinked

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })

    .then(() => {
      return db.query(
        `CREATE TABLE topics(
    slug VARCHAR PRIMARY KEY,
    description VARCHAR(40) NOT NULL, 
    img_url VARCHAR(1000)
    );`
      );
    })

    .then(() => {
      return db.query(
        `CREATE TABLE users(
  username VARCHAR PRIMARY KEY,
  name VARCHAR(40) NOT NULL, 
    avatar_url VARCHAR(1000)
    );`
      );
    })

    .then(() => {
      return db.query(
        `CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR, 
    topic VARCHAR,
    author VARCHAR,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000),
    FOREIGN KEY (topic) REFERENCES topics(slug),
    FOREIGN KEY (author) REFERENCES users(username)
    );`
      );
    })

    .then(() => {
      return db.query(
        `CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT,
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (author) REFERENCES users(username),
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        name VARCHAR(40) NOT NULL, 
          avatar_url TEXT
          );`
      );
    });
  // .then(() => {
  //   return db.query(
  //     `INSERT INTO topics (description, slug, img_url)
  //     VALUES %L;`,
  //     [
  //       ["The man, the Mitch, the legend", "mitch", ""],
  //       ["Not dogs", "cats", ""],
  //       ["what books are made of", "paper", ""],
  //     ]
  //   );
  // });
};

module.exports = seed;
