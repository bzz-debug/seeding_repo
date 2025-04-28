const { selectTopics, selectArticles } = require("../models/news.models");
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

const getArticles = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getApi, getTopics, getArticles };
