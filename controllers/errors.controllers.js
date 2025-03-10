exports.endpointErrorHandler = (req, res) => {
  res.status(404).send({ error: { message: "Resource not found", code: 404 } });
};

exports.handleServerErrors = (req, res) => {
  res.status(500).send({ error: { message: "Server error", code: 500 } });
};
