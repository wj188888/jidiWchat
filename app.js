//app.js
App({
  onLaunch: function () {
    //获取手机系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.version = res.model

      }
    })

  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //登录
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);
              wx.setStorageSync("userInfo", res.userInfo)
              var encryptedData = res.encryptedData; //一定要把加密串转成URI编码
              var iv = res.iv;
              //请求自己的服务器
              wx.request({
                url: that.globalData.serverUrl + 'Login/getWeiXinOpenid',
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'content-type': 'application/json'
                }, // 设置请求的 header
                success: function (res) {
                  var data = JSON.parse(res.data.trim());
                  that.globalData.userid = data.data.token
                },
                fail: function () {

                },
                complete: function () {

                }
              })
            }
          })

        },
        fail: function () {
          wx.showModal({

            title: '警告',
            content: '您点击了拒绝授权,将无法正常使用小程序,点击确定重新获取授权。',
            showCancel: false,

            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
                      wx.getUserInfo({
                        success: function (res) {
                          that.globalData.userInfo = res.userInfo

                        }
                      })
                    }
                  },
                  fail: function (res) {

                  }
                })

              }
            }
          })
        },
        complete: function (res) {

        }
      })
    }

  },

  globalData: {
    userInfo: null,
    userid: "",
    version: '', //自动获取手机型号
    system: '', //系统版本号
    serverUrl: "https://xcx.yunbaite.com/api/"
  },

})