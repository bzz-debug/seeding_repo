const {
  selectTopics,
  selectArticlesById,
  selectAllArticles,
  selectCommentsByArticleId,
} = require("../models/news.models");
const endpoints = require("../../endpoints.json");

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

module.exports = {
  getApi,
  getTopics,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
};
