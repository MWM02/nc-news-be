const express = require("express");
const cors = require("cors");
const { apiRouter } = require("./api_routers/api.router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

module.exports = app;
