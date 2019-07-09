// pages/person/person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    userid:"",
    value: [0, 0],
    idd:""
  },
  // 我的订单
  toorder:function(){
   wx.navigateTo({
     url: '../myorder/myorder',
   })
  },
//我的优惠券
   tocoupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  //拨打电话
  gocall:function(){
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
   this.setData({
     userInfo: app.globalData.userInfo,
     userid: app.globalData.userid
   })
   var token = this.data.userid
   //请求服务器获取数据
   var token = this.data.userid
   var that=this
   //请求服务器获取数据
   wx.request({
     url: app.globalData.serverUrl + 'Home/replaceModel',
     data: {
       token: token,
     },
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function (res) {
   
       var brandArr = res.data.data;
       var value = that.data.value
       var id = brandArr[value[0]]
    
       that.setData({
         brandArr: brandArr,
         idd: brandArr[value[0]].id
       })

     },
     fail: function () {
       // fail
     },
     complete: function () {
       // complete

     }
   })
   var id = that.data.idd
   wx.request({
     url: app.globalData.serverUrl + 'Home/replaceModel',
     data: {
       token: token,
       id: id

     },
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     // header: {}, // 设置请求的 header
     success: function (res) {
       console.log(res);

       var modelArr = res.data.data;
       that.setData({
         modelArr: modelArr
       })

     },
     fail: function () {
       // fail
     },
     complete: function () {
       // complete

     }
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