exports.endpointErrorHandler = (req, res) => {
  res.status(404).send({ error: { message: "Resource not found" } });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      error: { message: "Invalid text representation" },
    });
  } else if (err.code === "23502") {
    res.status(400).send({
      error: { message: "Not null violation" },
    });
  } else if (err.code === "23503") {
    res.status(400).send({
      error: { message: "Foreign key violation" },
    });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.error.status && err.error.message) {
    res
      .status(err.error.status)
      .send({ error: { message: err.error.message } });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (req, res) => {
  res.status(500).send({ error: { message: "Server error" } });
};
