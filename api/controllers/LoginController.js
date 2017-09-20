module.exports = {
  loginG(req, res) {
    if (req.session.leader) {
      return res.redirect('/dashboard');
    }
    return res.view('login');
  },
  loginP(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    var companyId = req.param('companyId');
    var companyName = req.param('companyName');
    if (!companyId && !companyName) {
      return res.error("企业信息不存在");
    }
    if (!username || !password) {
      return res.error("用户名或密码不能为空");
    }

    ApiService.request(null, {
      url: 'company/auth/login',
      method: 'post'
    }, {
      username: username,
      password: password,
      companyId: companyId,
      companyName: companyName,
    }, data => {
      if (data.code == 200) {
        // save to session.
        var leader = data.data
        sails.log('save leader to session, leader info:', JSON.stringify(leader))
        req.session.leader = leader;
        return res.ok({
          code: 200
        });
      }
      return res.ok(data);
    })
  },
  logout(req, res) {
    if (req.session.leader) {
      req.session.leader = null
    }
    return res.data();
  },
  getStatus (req, res) {
    var status = req.session.leader ? 1 : 0
    res.ok({
      code: 200,
      data: status
    })
  }
};
