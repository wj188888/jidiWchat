// pages/myorder/myorder.js
const api = require('../../utils/API.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },
  // 查看订单详情
  goorderInfo: function (e) {
    var orderid = e.currentTarget.dataset.orderid;
    var orderstate = e.currentTarget.dataset.orderstate
    wx.navigateTo({
      url: '../orderinfo/orderinfo?orderid=' + orderid + '&orderstate=' + orderstate,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    api.orderList().then(res => {
      this.setData({
        orderList: res.result
      })
    })
  }

})