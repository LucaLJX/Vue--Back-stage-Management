var auth = require('../api/middleware/auth');

module.exports = {
  http: {
    customMiddleware: function (app) {
      app.use('/dashboard', auth);

    }
  }
};
