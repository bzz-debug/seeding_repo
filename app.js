const express = require('express');
const app = express();
const db = require('./db/connection');
const cors = require('cors');

const {
  getApi,
  getTopics,
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  postNewComment,
  patchArticleVotes,
  removeCommentById,
  getUsers,
} = require('./api/controllers/news.controllers');

app.use(cors());

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', postNewComment);

app.patch('/api/articles/:article_id', patchArticleVotes);

app.delete('/api/comments/:comment_id', removeCommentById);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ message: 'bad request' });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'internal server error' });
});

module.exports = app;
