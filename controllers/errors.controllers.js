exports.endpointErrorHandler = (req, res) => {
  res.status(404).send({ error: { message: "Resource not found" } });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const errCodeToMessage = {
    "22P02": "Invalid text representation",
    23502:
      " A required field was not provided. Please ensure all necessary information is filled in and try again",
    23503: "The referenced data does not exist. Please check and try again",
    42703:
      "The specified field is invalid. Please check your input and try again.",
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
