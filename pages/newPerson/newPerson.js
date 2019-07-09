// pages/newPerson/newPerson.js
const api = require('../../utils/API.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_engineer:'',//维修工程师订单
    memberInfo: '',
    serviceTel: ''
  },
  // 跳转到设置界面
  goSet:function(){
    wx.navigateTo({
      url: '../setting/setting',
    });
  },
  // 跳转到我的订单
  toorder: function () {
    wx.navigateTo({
      url: '../userorder/userorder?state=0',
    });
  },

  // 待确认
  toConfirmOrder:function(){
    wx.navigateTo({
      url: '../userorder/userorder?state=1',
    });
  },
  // 维修中
  toRepairOrder:function(){
    wx.navigateTo({
      url: '../userorder/userorder?state=2',
    });
  },
  // 待付款
  toPayOrder:function(){
    wx.navigateTo({
      url: '../userorder/userorder?state=3',
    });
  },
  // 已完成
  toCompleteOrder:function(){
    wx.navigateTo({
      url: '../userorder/userorder?state=4',
    });
  },
  // 已取消
  toCancelOrder:function(){
    wx.navigateTo({
      url: '../userorder/userorder?state=5',
    });
  },

  //前往维修工程师订单
  toengineer:function(){
    wx.navigateTo({
      url: '../attendant/attendant',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取banner图
    api.member_index({}, { showLoading: false }).then(res => {
      this.setData({
        shop_engineer: res.result.shop_engineer,
        memberInfo: res.result.memberInfo,
        serviceTel: res.result.serviceTel
      })
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