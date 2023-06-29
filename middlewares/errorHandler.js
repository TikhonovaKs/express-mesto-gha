const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // res.status(statusCode).send({ message: /*statusCode === 500 ? 'Server error' :*/ message });
  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;