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

module.exports = { selectTopics, selectArticles };
