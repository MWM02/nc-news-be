const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  endpointErrorHandler,
  handleServerErrors,
} = require("./controllers/errors.controllers");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("*", endpointErrorHandler);

app.use(handleServerErrors);

module.exports = app;
