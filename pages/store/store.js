// pages/store/store.js
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    storelist: [],
    storename: "", //门店名称
    storeaddre: "", //门店地址
    storeid: "", //门店地址
    page: 0,
    latitude: "", //纬度
    longitude: "", //经度
    windowHeight: 0, //获取屏幕高度 
    refreshHeight: 0, //获取高度 
    userid: "",
    search_tit: "", //搜索值
    loadingHidden:false
  },
  // 点击门店
  storechoose: function (e) {
    console.log(e)
    this.setData({
      storename: e.currentTarget.dataset.nickname,
      storeaddre: e.currentTarget.dataset.address,
      storeid: e.currentTarget.dataset.id
    })
    var data = {

      storename: e.currentTarget.dataset.name,
      storeaddre: e.currentTarget.dataset.addre,
      storeid: e.currentTarget.dataset.id
    }

    console.log(data)
    try {
      wx.setStorageSync('store_data', data)
    } catch (e) {
      console.log("address页面的保存本地数据catch")
      console.log(e)
    }

    wx.navigateBack({
      delta: 1
    })

  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    var that = this;
 
 
    that.setData({
      userid: app.globalData.userid
    })
 
    console.log(app.globalData.userid)
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude, //纬度
          longitude: res.longitude, //经度
        })
        var token = that.data.userid
        //请求服务器获取数据
        wx.request({
          url: app.globalData.serverUrl + 'Scheme/getStoreList',
          data: {
            token: token,
            lat: res.latitude,
            lon: res.longitude
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data.data.info)

            that.setData({
              storelist: res.data.data.info
            })

            let list = res.data.data.info;
            for (let i = 0; i < list.length; i++) {
              let distance = parseInt(list[i].distance);
              let temp = 'storelist[' + i + '].distance';
              that.setData({
                [temp]: distance
              })
            }
          }

        })
      }
    })

  },
  // 搜索门店
  searchValueInput: function (e) {

    var value = e.detail.value;
    this.setData({
      search_tit: value,
    });

  },
  search_btn: function () {
    var that = this
    var token = that.data.userid
    var title = that.data.search_tit
    var lat = that.data.latitude
    var lon = that.data.longitude

    //请求服务器获取数据
    wx.request({
      url: app.globalData.serverUrl + 'Scheme/getStoreList',
      data: {
        token: token,
        title: title,
        lat: lat,
        lon: lon
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          storelist: res.data.data.info
        })
        let list = res.data.data.info;
        for (let i = 0; i < list.length; i++) {
          let distance = parseInt(list[i].distance);
          let temp = 'storelist[' + i + '].distance';
          that.setData({
            [temp]: distance
          })
        }
      },

    })
  },
  //拨打电话
  callbtn: function (e) {

    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  //查看地图
  mapbtn: function (e) {
    console.log(e)
    var lat = parseFloat(e.currentTarget.dataset.lat)
    var lng = parseFloat(e.currentTarget.dataset.lng)

    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 28
    })
  },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () {

  },

	/**
	 * 生命周期函数--监听页面显示
	 */
  onShow: function () {

  },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function () {

  },

	/**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload: function () {

  },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () {

  },

	/**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () {

  },

	/**
	 * 用户点击右上角分享
	 */
  onShareAppMessage: function () {

  }
})