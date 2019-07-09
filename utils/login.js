import Ajax from "./Ajax"
import config from "../config"
function login(callback) {
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      Ajax({
        url: `${config.API_HOST}/appApi/?p=wx&m=login`,
        data: { js_code: res.code },
        type: "get",
        success: data => {
          data.userInfo ? wx.setStorageSync('authorityLogin', data.userInfo) : null;
          wx.setStorage({
            key: "token",
            data: data.token,
            success: function () {
              callback(data.token)
            }
          });
        }
      });
    }
  })
}

module.exports = login;