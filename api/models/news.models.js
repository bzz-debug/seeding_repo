const db = require("../../db/connection");

const selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "No topics here!" });
    }
    return result.rows;
  });
};

const selectArticles = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `No article with ID: ${article_id} found!`,
        });
      }
      return result.rows[0];
    });
};

const selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
ORDER BY created_at DESC
    `
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "No articles found!",
        });
      }
      result.rows.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });

      return result.rows;
    });
};

module.exports = { selectTopics, selectArticles, selectAllArticles };
