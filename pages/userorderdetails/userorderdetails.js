// pages/userorderdetails/userorderdetails.js
const api = require('../../utils/API.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPaydialog: false,//付款弹窗

    orderid: '',//订单id
    orderDetails: '',//订单详情
    price: '',//实际支付价格
    // 订单详情按钮显示隐藏
    btnStateObj: {
      showCancelOrderBtn: false,//显示取消订单按钮
      showPayCompleteBtn: false,//显示立即付款按钮
      showEvaluateOrderBtn: false,//显示立即评价按钮
      showViewEvaluateBtn: false,//显示查看评价按钮      
    },

    showDialogCancelOrder: false,//取消订单弹窗
    reson_items: [
      { id: 0, cancelCause: '不想要维修了', checked: false },
      { id: 1, cancelCause: '重复下单', checked: false },
      { id: 2, cancelCause: '下错单了', checked: false }
    ],//取消原因列表
    cancelCause: '',//取消原因
    radioCause: '',
    inputCause: '',
  },

  // 联系他
  callbtn: function (e) {
    var customerTel = e.currentTarget.dataset.customertel
    wx.makePhoneCall({
      phoneNumber: customerTel //仅为示例，并非真实的电话号码
    })
  },

  // 取消订单
  cancelOrder: function () {
    this.setData({
      showDialogCancelOrder: true
    })
  },
  // 关闭取消订单弹窗
  closeCanceldialog: function () {
    this.setData({
      showDialogCancelOrder: false
    })
  },
  // 单选框选择原因
  radioChange: function (e) {
    var radioCause = ""
    var inputCause = this.data.inputCause;
    if (e.detail.value) {
      var radioCause = e.detail.value;
    } else {
      var radioCause = "";
    }
    this.setData({
      cancelCause: radioCause,
      radioCause: radioCause,
      inputCause: ""
    })
  },

  // 输入框输入取消原因
  causeorder: function (e) {
    var inputCause = e.detail.value;
    if (inputCause) {
      this.setData({
        cancelCause: inputCause
      })
    }
  },
  inputFocus: function (e) {
    var resonitems = this.data.reson_items;
    for (var i = 0; i < resonitems.length; i++) {
      resonitems[i].checked = false;
    }
    this.setData({
      reson_items: resonitems
    })
  },

  // 确认取消订单
  changeorderbsure: function () {
    var cancelCause = this.data.cancelCause;
    var orderid = this.data.orderid;
    api.order_cause({ cancelCause: cancelCause, orderid: orderid }).then(res => {
      var flag = true;
      if (res.errcode == "FAIL") {
        wx.showModal({
          title: '提示',
          content: res.errmsg
        })
        flag = false;
      }
      this.getOrderDetails(orderid);
    })
    this.setData({
      showDialogCancelOrder: false
    })
  },

  // 立即付款
  payment: function () {
    this.setData({
      showPaydialog: true
    });
  },

  // 关闭支付弹窗
  closePayDialog: function () {
    this.setData({
      showPaydialog: false
    });
  },

  // 立即评价
  goEvaluate: function () {
    wx.navigateTo({
      url: '../goevaluate/goevaluate?orderid=' + this.data.orderid,
    })
  },

  // 查看评价
  lookEvaluate: function () {
    var orderid = this.data.orderid;
    api.evaluate_view({ orderid: orderid }).then(res => {
      if (res.errcode == "FAIL") {
        wx.showModal({
          title: '提示',
          content: res.errmsg
        });
      } else {
        wx.navigateTo({
          url: '../lookevaluate/lookevaluate?orderid=' + this.data.orderid,
        })
      }
    })

  },

  //获取订单详情
  getOrderDetails: function (orderid) {
    api.userorderDetails({ orderid: orderid }).then(res => {
      const { orderState, serviceState } = res.result;
      // 判断页面按钮显示隐藏
      const btnStateObj = {
        showCancelOrderBtn: orderState == "0" && serviceState == "0",
        showPayCompleteBtn: orderState == "20" && serviceState == "20",
        showEvaluateOrderBtn: orderState == "21" && serviceState == "20",
        showViewEvaluateBtn: orderState == "100" && serviceState == "20"
      }
      const price = (res.result.orderPrice - res.result.couponPrice).toFixed(2);
      this.setData({
        orderDetails: res.result,
        price: price,
        btnStateObj: btnStateObj
      });
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
    this.getOrderDetails(orderid)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var orderid = this.data.orderid;
    this.getOrderDetails(orderid);
  }
})