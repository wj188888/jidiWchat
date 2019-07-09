// pages/attendant/attendant.js
const api = require('../../utils/API.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shop_engineer: '',
    orderCancel: '',//已取消
    orderComplete: '',//已完成
    orderPendingPayment: '',//待付款
    orderRepair: '',//维修中
    orderUnconfirmed: '',//待确认

    changeMask: false,//更改手机号弹窗
    changeDialog: false,
    tel: '',//更换的手机号
    telError:'',//手机号错误提示文字显示
  },

  // 更改绑定手机号弹窗显示
  showChangePhone: function () {
    this.setData({
      changeMask: true,
      changeDialog: true,
    })
  },
  // 更改绑定手机号 隐藏弹窗
  disChangePhone: function () {
    this.setData({
      changeMask: false,
      changeDialog: false,
    })
  },
  // 关闭更改手机弹窗
  closeChangePhone: function () {
    this.disChangePhone();
  },
  // 关闭更改手机弹窗
  closeChangePhone: function () {
    this.disChangePhone();
  },
  // 获取修改的手机号
  changePhoneIpt: function (e) {
    console.log(e)
    var tel = e.detail.value;
    this.setData({
      tel: tel
    })
  },
  // 确认更改手机
  submitChangePhone: function () {
    var tel = this.data.tel;
    var telError = this.data.telError;
    var reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!reg.test(tel)) {
      this.setData({
        telError: true
      })
      return false;
    } else {
      this.setData({
        telError: false
      })
      api.editBusinessTel({ tel: tel }).then(res => {
        this.getEngineerInfo();
      });
      this.disChangePhone();
    }
  },

  /**
   * 订单列表查看
   */
  //已取消
  lookOrderCancel: function () {
    wx.navigateTo({
      url: '../engineerorder/engineerorder?state=5',
    })
  },
  //已完成
  lookOrderComplete: function () {
    wx.navigateTo({
      url: '../engineerorder/engineerorder?state=4',
    })
  },
  //待付款
  lookOrderPendingPayment: function () {
    wx.navigateTo({
      url: '../engineerorder/engineerorder?state=3',
    })
  },
  //维修中
  lookOrderRepair: function () {
    wx.navigateTo({
      url: '../engineerorder/engineerorder?state=2',
    })
  },
  //待确认
  lookOrderUnconfirmed: function () {
    wx.navigateTo({
      url: '../engineerorder/engineerorder?state=1',
    })
  },

  // 获取工程师信息
  getEngineerInfo:function(){
    api.engineerIndex().then(res => {
      this.setData({
        shop_engineer: res.result.shop_engineer,
        orderCancel: res.result.orderCancel,
        orderComplete: res.result.orderComplete,
        orderPendingPayment: res.result.orderPendingPayment,
        orderRepair: res.result.orderRepair,
        orderUnconfirmed: res.result.orderUnconfirmed
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEngineerInfo();
  }
})