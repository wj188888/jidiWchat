// pages/orderinfo/orderinfo.js
const api = require('../../utils/API.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    visti_show: false,//上门
    gostore_show: false,//到店
    yj_show: false,//邮寄
    xc_show: false,//现场
    orderid: "",//订单id
    orderstate: '',//订单状态
    orderDetails: {},//订单详情
    couponPrice: '',//优惠券
    orderPrice: "",//维修价格
    countPrice: "",//预计需支付
    ordermask: false,//取消订单蒙层
    dialogordershow: false,//取消订单弹窗
    reson_items: [
      { id: 0, cancelCause: '不想要维修了', checked: false },
      { id: 1, cancelCause: '重复下单', checked: false },
      { id: 2, cancelCause: '下错单了', checked: false },
    ],//取消原因列表
    cancelCause: '',//取消原因
    radioCause: '',
    inputCause:''
  },

  // 显示取消订单弹窗
  cancelorder: function () {
    this.setData({
      ordermask: true,
      dialogordershow: true,
    });
    var radioCause = ""
    this.setData({
      radioCause: radioCause
    })
  },
  // 隐藏取消订单弹窗
  displayorder: function () {
    this.setData({
      ordermask: false,
      dialogordershow: false,
    })
  },
  // 取消取消订单
  cancelorderbbtn: function () {
    this.displayorder();
  },
  //取消订单选择原因
  radioChange: function (e) {
    var radioCause = ""
    var inputCause = this.data.inputCause;
    if (e.detail.value) {
      var radioCause = e.detail.value
    } else {
      var radioCause = "";
    }
    this.setData({
      cancelCause: radioCause,
      radioCause: radioCause,
      inputCause:""
    })
  },
  // 填写取消订单
  causeorder: function (e) {
    var inputCause = e.detail.value;
    if (inputCause){
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
  // 确定取消订单
  changeorderbsure: function () {
    this.displayorder();
    var orderid = this.data.orderid;
    var cancelCause = this.data.cancelCause;
    var params = {
      orderid: orderid,
      cancelCause: cancelCause
    }
    api.order_cause(params).then(res => {
      var flag = true;
      if (res.errcode == "FAIL") {
        wx.showModal({
          title: '提示',
          content: res.errmsg
        })
        flag = false;
      }

      if (flag) {
        // 选中返回上一页
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      orderstate: options.orderstate
    })
    var orderid = this.data.orderid;
    api.order_details({ orderid: orderid }).then(res => {
      this.setData({
        orderDetails: res.result,//订单详情信息
        orderPrice: res.result.orderPrice,
        couponPrice: res.result.couponPrice
      })
      // 计算预计需支付价格
      var orderPrice = this.data.orderPrice;
      var couponPrice = this.data.couponPrice;
      var countprice = orderPrice - couponPrice;
      this.setData({
        countPrice: countprice
      })
      // 服务信息显示
      if (res.result.serviceType == "1") {
        this.setData({
          visti_show: true,
        })
      }
      if (res.result.serviceType == "2") {
        this.setData({
          gostore_show: true,
        })
      }
      if (res.result.serviceType == "3") {
        this.setData({
          yj_show: true,
        })
      }
      if (res.result.serviceType == "4") {
        this.setData({
          xc_show: true,
        })
      }
    });

  }

})