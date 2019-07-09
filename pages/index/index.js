//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })         
        }
      })
    }
  },
  getPhoneNumber: function (res) {
    wx.request({
      url: 'http://yunbaite.csoft.com/appApi/?p=wx&m=getPhoneNumber',
      data: Object.assign({ encryptedData: res.detail.encryptedData, iv: res.detail.iv, token: app.globalData.token }),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        app.globalData.token = res.data.token
        console.log('getPhoneNumber result token:', res.data.token)
        console.log(res.data)
      }
    })
  },
  getLocation: function(){
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        wx.request({
          url: 'http://yunbaite.csoft.com/appApi/?p=wx&m=updateLocation',
          data: Object.assign({ 
              latitude: res.latitude,
              longitude: res.longitude,
              speed: res.speed,
              accuracy: res.accuracy,
              altitude: res.altitude,
              verticalAccuracy: res.verticalAccuracy,
              horizontalAccuracy: res.horizontalAccuracy,
              token: app.globalData.token
            }),
          method: "post",
          header: {
            'content-type': 'application/json'
          },
          success: (res) => {
            app.globalData.token = res.data.token
            console.log(res.data)
          }
        })
      }
    })
  },
  getUserInfo: function(e) {
    wx.getUserInfo({
      success: res => {
        console.log("index_getUserInfo", res);
        // 可以将 res 发送给后台解码出 unionId
        wx.request({
          url: 'http://yunbaite.csoft.com/appApi/?p=wx&m=getUserInfo',
          data: Object.assign({ encryptedData: res.encryptedData, iv: res.iv, token: app.globalData.token }),
          method: "post",
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            app.globalData.token = res.data.token
            console.log(res.data)
          }
        })

        app.globalData.userInfo = res.userInfo

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }, lang: "zh_CN"
    })

  }
})
