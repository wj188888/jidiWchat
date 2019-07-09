// pages/engineerorder/engineerorder.js
const api = require('../../utils/API.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curIndex:1,
    pageList:'',//列表数据
  },

  // tab切换
  bindTab:function(e){
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index,
    },()=>{
      this.getOrderList(index);
    })
  },

  // 查看订单详情
  lookOrderDetail:function(e){
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../engineerorderdetails/engineerorderdetails?orderid=' + orderid,
    })
  },
  // 获取订单列表
  getOrderList: function (state){
    api.engineerorderList({ state: state}).then(res => {
      this.setData({
        pageList: res.result.pageList
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置默认进入状态
    var state = options.state;
    this.setData({
      curIndex: state
    },()=>{
      this.getOrderList(state);
    });
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var curIndex = this.data.curIndex;
    this.getOrderList(curIndex);
  }
})