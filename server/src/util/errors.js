const handleMongooseError = (msg, error) => {
  if (error) {
    console.warn(msg, error);
  }
}

module.exports = {
  handleMongooseError
}
