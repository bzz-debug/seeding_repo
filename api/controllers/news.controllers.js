const {
  selectTopics,
  selectArticlesById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertNewComment,
  updateArticleVotes,
  deleteCommentById,
  selectUsers,
} = require('../models/news.models');
const endpoints = require('../../endpoints.json');
const db = require('../../db/connection');
const { sort } = require('../../db/data/test-data/articles');

const getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

const getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllArticles = (req, res, next) => {
  const sortBy = req.query.sort_by || 'created_at';
  const orderBy = (req.query.order || 'desc').toUpperCase();

  const topic = req.query.topic;

  selectAllArticles(sortBy, orderBy, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  console.log(newComment);

  if (!newComment) {
    return Promise.reject({
      status: 400,
      message: 'please write a comment',
    });
  }

  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      message: 'bad request',
    });
  }

  const findValidUser = (newComment) => {
    return db.query(`SELECT username FROM users`).then(({ rows }) => {
      const usernameArray = rows.map((user) => Object.values(user));

      if (usernameArray.flat().includes(newComment.username)) {
        return true;
      }
      return false;
    });
  };

  return findValidUser(newComment).then((validUser) => {
    if (!validUser) {
      next({
        status: 400,
        message: 'invalid username',
      });
    } else {
      return selectArticlesById(article_id)
        .then((article) => {
          return insertNewComment(newComment, article.article_id);
        })
        .then((postedComment) => {
          res.status(201).send({ postedComment });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
};

const patchArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: 'bad request',
    });
  }
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      message: 'bad request',
    });
  }
  updateArticleVotes(inc_votes, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

const removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then((deleteStatus) => {
      if (isNaN(comment_id)) {
        return Promise.reject({
          status: 400,
          message: 'bad request',
        });
      }

      if (deleteStatus.success === true) {
        res.status(204).send();
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getApi,
  getTopics,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  postNewComment,
  patchArticleVotes,
  removeCommentById,
  getUsers,
};
