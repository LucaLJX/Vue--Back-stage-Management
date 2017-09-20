/**
 * 页面路由
 */

module.exports.routes = {
  '/': function (req, res) {
    return res.redirect('/dashboard')
  },
  'get /login': 'LoginController.loginG',
  'post /login': 'LoginController.loginP',
  'get /logout': 'LoginController.logout',

  'post /login/status': 'LoginController.getStatus',
  '/dashboard': { view: 'dashboard' }
};
