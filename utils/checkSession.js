import login from "./login"
function checkSession(callback = function () { }) {
  wx.checkSession({
    success: function () {
      // console.log("wx.checkSession未过期")
      wx.getStorage({
        key: 'token',
        success: function (res) {
          // console.log("从storage获取token成功")
          callback(res.data)
        },
        fail: function (err) {
          // console.log("从storage获取token失败")
          login(callback)
        }
      })
      //session 未过期，并且在本生命周期一直有效
    },
    fail: () => {
      //登录态过期
      // console.log("wx.checkSession已过期")
      login(callback)
    }
  })
}

module.exports = checkSession;