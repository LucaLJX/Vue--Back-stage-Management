//通过微信api获取openid. 存放在req.session.openid
module.exports = function (req, res, next) {
  var leader = req.session.leader;
  console.log('当前登录用户信息:', leader);

  if (leader) {
    return next();
  }

  sails.log('无用户信息,请先登录.');
  return res.redirect('/login');

};
