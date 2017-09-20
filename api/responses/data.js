/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendData(data, msg) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;

  var message = null;
  if(msg) {
    message = msg;
  }

  // Set status code
  res.status(200);

  return res.json({
    code: 200,
    msg: message,
    data: data
  });

};
