/**
 * 首页
 */
module.exports = {
  homePage(req, res) {
    ApiService.request(req, {
      url: 'homeInfo',
      method: 'post'
    }, {
      staffId: 5972,
      companyId: 2
    }, data => {
      res.ok(data)
    })
  }
}
