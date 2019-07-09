// pages/coupon/coupon.js
var app = getApp();
var index = 0
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    curIndex: 0,//tab切换值
    cancoupon: 0,//可用券集合
    endcoupon: 0,//已使用券集合
    couponlist: [],
    currentItem: 0,//选中样式值

  },
  //tab切换事件
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  //优惠券点击事件
  // couponclk: function (event){
  //   console.log(event.currentTarget.dataset.money)
  //   var num = event.target.dataset.num;
  //   var couponlist = this.data.couponlist;
  //   for (var i = 0; i < couponlist.length; i++) {
  //     if (i == num) {

  //       couponlist[num].class = !couponlist[num].class;

  //     } else {
  //       couponlist[i].class = false;
  //     }
  //   }
  //   this.setData({
  //     couponlist: couponlist,
  //   })

  //   wx.navigateBack({

  //   })

  // },

  couponclk: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id;
    //设置当前样式
    that.setData({
      currentItem: id
    })

    var data = {
      currentItem: e.currentTarget.dataset.id,
      couponName: e.currentTarget.dataset.name, //优惠券名称
      couponid: parseInt(e.currentTarget.dataset.id), //优惠价格
    }
    console.log(data)
    wx.setStorageSync("coupon_data", data)

    wx.navigateBack({})

  },

  couponclk2: function (e) {
    wx.showToast({
      title: '该优惠券已使用',
      icon: 'info',
      duration: 2000
    })
  },
  //时间戳转换时间  
  toDate: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {

    this.setData({
      currentItem: options.currentItem
    })
    var couponlist = this.data.couponlist
    if (this.data.cancoupon==0) {
      wx.showModal({
        title: '提示',
        content: '没有可使用的优惠券',
       
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack();
          } else if (res.cancel) {
          
          }
        }
      })
    }

    var that = this
    var token = app.globalData.userid
    //请求服务器获取数据
    wx.request({
      url: app.globalData.serverUrl + 'Coupon/index',
      data: {
        token: token,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        var couponlist = res.data.data
        var can = []//可使用
        var end = []//已使用
        for (var i = 0; i <= couponlist.length; i++) {
          couponlist[i].create_time = that.toDate(couponlist[i].create_time)
          if (couponlist[i].type == 1) {
            couponlist[i].type = "优惠券"
            console.log(couponlist[i].type)
          }
          if (couponlist[i].type == 2) {
            couponlist[i].type = "抵扣券"
          }
          if (couponlist[i].status == 1) {
       
            that.setData({
              couponlist: can,
              cancoupon: can.length,
            })
           
          }
          if (couponlist[i].status == 2) {

            end.push(couponlist[i])
            that.setData({
              couponlist2: end,
              endcoupon: end.length
            })
           
          }

        }

      },

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