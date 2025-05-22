const db = require('../../db/connection');

const selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: 'No topics here!' });
    }
    return result.rows;
  });
};

const selectArticlesById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
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

const selectAllArticles = (sortBy, orderBy, topic) => {
  const validSortBy = [
    'article_id',
    'title',
    'topic',
    'author',
    'body',
    'created_at',
    'votes',
  ].includes(sortBy);

  const validOrderBy = ['ASC', 'DESC'].includes(orderBy);

  if (!validSortBy || !validOrderBy) {
    return Promise.reject({
      status: 400,
      message: 'Bad request',
    });
  }

  const queryValues = [];
  let sqlString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments
    ON articles.article_id = comments.article_id`;
  if (topic) {
    sqlString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }
  sqlString += ` GROUP BY articles.article_id
    ORDER BY ${sortBy} ${orderBy}`;

  return db.query(sqlString, queryValues).then((result) => {
    if (topic && !result.rows.length) {
      return Promise.reject({
        status: 404,
        message: "topic doesn't exist",
      });
    }

    return result.rows;
  });
};

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.*, articles.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1
      ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'No comments found',
        });
      }

      return rows;
    });
};

const insertNewComment = (newComment, article_id) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING author, body`,
      [article_id, newComment.username, newComment.body]
    )
    .then(({ rows }) => {
      rows[0].username = rows[0].author;
      delete rows[0].author;

      return rows[0];
    });
};

const updateArticleVotes = (inc_votes, article_id) => {
  return db
    .query(
      `
    UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'No articles found',
        });
      }

      return rows[0];
    });
};

const deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return { success: true, message: 'comment deleted' };
      } else
        return Promise.reject({
          status: 404,
          message: 'no comment found',
        });
    });
};

const selectUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users`)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'No users here!' });
      }
      return result.rows;
    });
};

module.exports = {
  selectTopics,
  selectArticlesById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertNewComment,
  updateArticleVotes,
  deleteCommentById,
  selectUsers,
};
