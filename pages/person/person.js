// pages/pageIndex/pageIndex.js
const api = require('../../utils/API.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shop_engineer:'',//维修订单
    banner: [],//banner图
    avatarUrl: '',//用户头像
    nickname: '',//用户名
  },
  // 跳转到我的订单
  toorder: function () {
    wx.navigateTo({
      url: '../userorder/userorder',
    })
    // wx.navigateTo({
    //   url: '../myorder/myorder',
    // })
  },
  // 跳转到我的优惠券
  tocoupon: function () {
    // wx.navigateTo({
    //   url: '../coupon/coupon',
    // })
  },
  // 跳转到管理维修订单
  toengineer: function () {
    wx.navigateTo({
      url: '../attendant/attendant',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取banner图
    api.member_index({}, { showLoading: false }).then(res => {
      this.setData({
        banner: res.result.banner,
        shop_engineer: res.result.shop_engineer
      })
    })
    // 获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          nickname: res.data.nickname,
          avatarUrl: res.data.avatarUrl,
        })
      },
    })
  }
})