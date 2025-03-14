const { getEndpoints } = require("../controllers/endpoints.controllers");
const {
  endpointErrorHandler,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("../controllers/errors.controllers");
const topicsRouter = require("./subrouters/topics.router");
const articlesRouter = require("./subrouters/articles.router");
const commentsRouter = require("./subrouters/comments.router");
const usersRouter = require("./subrouters/users.router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("*", endpointErrorHandler);

apiRouter.use(handlePsqlErrors);

apiRouter.use(handleCustomErrors);

apiRouter.use(handleServerErrors);

module.exports = { apiRouter };
