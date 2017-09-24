//node file server (network file system)
var HOST = ''
if (process.env.NODE_ENV === 'production') {
  HOST = 'http://nfs-src.aceoffer.cn'

} else {
  // HOST = 'http://192.168.1.213:1367'
  // HOST = 'http://dev.sf8cloud.com:1367'
  HOST = 'http://nfs-src.sf8cloud.com/'
}

var uploadUrl = HOST + '/upload/file'

let nfsUtil = {
  uploadUrl: uploadUrl,
}

nfsUtil.getFileUrl = function (token) {
  if(!token || token.length == 0) {
    return null;
  }
  if(token.indexOf('EZ-NFS') == 0) {
    return HOST + '/receive/' + token;
  }
  return token;
}

if (typeof window !== 'undefined') {
  window.nfsUtil = nfsUtil
}

export default nfsUtil;
