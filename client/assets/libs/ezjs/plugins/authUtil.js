let authUtil = {};

authUtil.set = function (k, v) {
  if (typeof v == 'object') {
    sessionStorage.setItem(k, JSON.stringify(v))
  } else {
    sessionStorage.setItem(k, v)
  }
};
authUtil.get = function (k) {
  return sessionStorage.getItem(k)
};
authUtil.getObj = function (k) {
  var str = sessionStorage.getItem(k)
  return JSON.parse(str)
};

authUtil.user = function (user) {
  if (user) {
    //set
    if (typeof user != 'object') {
      throw new Error('user in session must be an object!');
    }
    authUtil.set('auth_user', user);
    return user;
  } else {
    //get
    return authUtil.getObj('auth_user');
  }
};

export default authUtil;
