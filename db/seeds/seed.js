const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");
const { createRef } = require("./utils");

// const ENV = process.env.NODE_ENV || "development";
// const topicsData = require(`../data/${ENV}-data/topics.js`);
// const usersData = require(`../data/${ENV}-data/users.js`);
// const articlesData = require(`../data/${ENV}-data/articles.js`);
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
        `CREATE TABLE users(
  username VARCHAR PRIMARY KEY,
  name VARCHAR(40) NOT NULL, 
    avatar_url VARCHAR(1000)
    );`
      );
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
        `CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL, 
    topic VARCHAR(100) REFERENCES topics(slug),
    author VARCHAR(100) REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
      );`
      );
    })

    .then(() => {
      return db.query(
        `CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(1000) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
          );`
      );
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });

      const topicInsert = format(
        `INSERT INTO topics (slug, description, img_url)
  VALUES %L;`,
        formattedTopics
      );
      return db.query(topicInsert);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const userInsert = format(
        `INSERT INTO users (username, name, avatar_url)
        VALUES %L;`,
        formattedUsers
      );
      return db.query(userInsert);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        const alteredArticle = convertTimestampToDate(article);
        return [
          alteredArticle.title,
          alteredArticle.topic,
          alteredArticle.author,
          alteredArticle.body,
          alteredArticle.created_at,
          alteredArticle.votes,
          alteredArticle.article_img_url,
        ];
      });
      const articleInsert = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING *;`,
        formattedArticles
      );

      return db.query(articleInsert);
    })
    .then((result) => {
      articlesRefObject = createRef(result.rows);
      const formattedComments = commentData.map((comment) => {
        const alteredComment = convertTimestampToDate(comment);
        return [
          articlesRefObject[comment.article_title],
          alteredComment.body,
          alteredComment.votes,
          alteredComment.author,
          alteredComment.created_at,
        ];
      });
      const commentInsert = format(
        `INSERT INTO comments (article_id, body, votes, author,created_at)
        VALUES %L;`,
        formattedComments
      );

      return db.query(commentInsert);
    });
};
module.exports = seed;
