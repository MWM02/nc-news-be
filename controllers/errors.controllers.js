exports.endpointErrorHandler = (req, res) => {
  res.status(404).send({ error: { message: "Resource not found" } });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const errCodeToMessage = {
    "22P02": "Invalid text representation",
    23502: "Not null violation",
    23503: "Foreign key violation",
    42703: "Undefined column",
  };
  if (errCodeToMessage[err.code]) {
    res.status(400).send({ error: { message: errCodeToMessage[err.code] } });
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
