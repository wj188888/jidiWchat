//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://yunbaite.csoft.com/appApi/?p=wx&m=login',
          data: Object.assign({ js_code: res.code }),
          method: "post",
          header: {
            'content-type': 'application/json'
          },
          success:  (res)=> {
            console.log(res.data)
            this.globalData.token = res.data.token
            // 获取用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // console.log("app_getUserInfo", res);
                      // 可以将 res 发送给后台解码出 unionId
                      wx.request({
                        url: 'http://yunbaite.csoft.com/appApi/?p=wx&m=getUserInfo',
                        data: Object.assign({ encryptedData: res.encryptedData, iv: res.iv, token: this.globalData.token }),
                        method: "post",
                        header: {
                          'content-type': 'application/json'
                        },
                        success:  (res)=> {
                          this.globalData.token=res.data.token
                          console.log('getUserInfo result token:',res.data.token)
                        }
                      })

                      this.globalData.userInfo = res.userInfo

                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }
                    }, lang: "zh_CN"
                  })
                }
              }
            })
          }
        })
      }
    })
    
  },
  globalData: {
    userInfo: null,
    token:null
  }
})