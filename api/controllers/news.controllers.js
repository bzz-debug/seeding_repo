const {
  selectTopics,
  selectArticlesById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertNewComment,
} = require("../models/news.models");
const endpoints = require("../../endpoints.json");
const db = require("../../db/connection");

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
  return selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
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

  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      message: "bad request",
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

  // const findValidId = (articleId) => {
  //   return db
  //     .query(`SELECT article_id FROM articles`)
  //     .then(({ rows }) => {
  //       console.log(rows);

  //       const articleIdArray = rows.map((id) => Object.values(id));

  //       if (articleIdArray.flat().includes(Number(articleId))) {
  //         return true;
  //       }
  //       return false;
  //     })
  //     .catch((err) => {

  //       next(err);
  //     });
  // };

  return findValidUser(newComment).then((validUser) => {
    if (!validUser) {
      next({
        status: 400,
        message: "invalid username",
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

module.exports = {
  getApi,
  getTopics,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  postNewComment,
};
