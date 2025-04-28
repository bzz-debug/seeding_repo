const express = require("express");
const app = express();
const db = require("./db/connection");

const { getApi, getTopics } = require("./api/controllers/news.controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
