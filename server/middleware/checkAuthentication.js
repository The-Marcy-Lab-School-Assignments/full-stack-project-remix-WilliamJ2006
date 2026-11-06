const checkAuthentication = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You must be logged in to do that.',
    });
  }

  next();
};

module.exports = checkAuthentication;
