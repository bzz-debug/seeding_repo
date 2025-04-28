const express = require("express");
const app = express();
const db = require("./db/connection");

const { getApi } = require("./api/controllers/news.controllers");

app.get("/api", getApi);

module.exports = app;
