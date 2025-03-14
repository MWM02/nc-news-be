const express = require("express");
const app = express();

const { apiRouter } = require("./api_routers/api.router");

app.use(express.json());

app.use("/api", apiRouter);

module.exports = app;
