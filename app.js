const api = require('utils/API.js');
//app.js
App({
  onLaunch: function () {
    // 获取地理位置
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            success: function (res) {
              var params = {
                latitude: res.latitude,
                longitude: res.longitude,
                speed: res.speed,
                accuracy: res.accuracy,
                altitude: res.altitude,
                verticalAccuracy: res.verticalAccuracy,
                horizontalAccuracy: res.horizontalAccuracy
              }
              api.updateLocation(params, { showLoading: false })
            },
          })
        }
      }
    });

  },
  onHide: function () {
    // 清除所有缓存
    wx.clearStorage();
  }
});