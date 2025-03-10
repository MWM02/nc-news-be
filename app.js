const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/endpoints.controllers");

console.log(getEndpoints);

app.get("/api", getEndpoints);

module.exports = app;
