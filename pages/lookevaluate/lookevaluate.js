// pages/evaluate/evaluate.js
const api = require('../../utils/API.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: '',//评分
    redStar: '',
    nostar: '',
    orderid: '',
    comment_point: '',//获取星级评价对应文字
  },

  // 返回首页
  goIndex: function () {
    wx.navigateBack({
      url: '../pageIndex/pageIndex',
      delta: 100
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.orderid;
    this.setData({
      orderid: orderid
    });
    // 获取评价配置
    api.evaluate_getConfig().then(res => {
      this.setData({
        comment_point: res.result.comment_point
      })
    });
    // 获取评价信息
    api.evaluate_view({ orderid: orderid }).then(res => {
      this.setData({
        evaluateDetail: res.result,
        point: res.result.point,
        redStar: parseInt(res.result.point),
        nostar: 5 - parseInt(res.result.point)
      });
    });
    // 获取星级评价对应的文字
    var comment_point = this.data.comment_point;
    var point = this.data.point;
    for (var i = 0; i < comment_point.length; i++) {
      if (i == point - 1) {
        this.setData({
          starTxt: comment_point[i]
        })
      }
    }
  }
})