// pages/engineerorderdetails/engineerorderdetails.js
const api = require('../../utils/API.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',//订单id
    orderDetails: '',//订单信息
    price: '',//实际支付金额

    // 订单详情按钮显示隐藏
    btnStateObj: {
      showConfirmOrderBtn: false,//显示确认订单按钮
      showConfirmPayCompleteBtn: false,//显示确认支付完成按钮
      showViewEvaluateBtn: false,//显示查看评价按钮
      showOrderStepBtn: false,//显示操作订单步骤按钮
    },
    // 订单转态下故障模块显示隐藏
    damageStateObj: {
      showConfirmOrderDamage: false,//显示待确认订单故障
      showRepairOrderDamage: false,//显示维修中订单故障
      showCompleteOrCancelDamage: false,//显示待付款、已完成、已取消订单故障
    },
    showdamageDialog: false,//故障弹窗显示隐藏
    damageList: '',//故障列表（包含故障类型）
    showDamageDetails: false,//故障类型和故障详情显示隐藏
    damage_items: [],//订单详情选中故障
    damageType: '',//故障类型
    damageDetailLists: [],//故障详情列表

    showStockDialog: false,//配件弹窗显示隐藏
    stockList: '',//配件列表（配件类型）
    showStockDetails: false,//配件类型和配件详情显示隐藏
    stockDetailLists: [],//配件详情
    curDamageIndex: '',//当前选中故障类型（添加配件时）

    showDialogCancelOrder: false,//取消订单弹窗
    reson_items: [
      { id: 0, cancelCause: '不想要维修了', checked: false },
      { id: 1, cancelCause: '重复下单', checked: false },
      { id: 2, cancelCause: '下错单了', checked: false }
    ],//取消原因列表
    cancelCause: '',//取消原因
    radioCause: '',
    inputCause: '',

    serviceStateNext: '',//下一步传递参数
  },

  // 添加故障
  addDamage: function () {
    this.setData({
      showdamageDialog: true,
    });
    var orderid = this.data.orderid;
    api.get_itemList({ orderid: orderid }).then(res => {
      this.setData({
        damageList: res.result
      });
    });
  },

  // 关闭选择故障弹窗
  closeChangeDamage: function () {
    this.setData({
      showdamageDialog: false,
      showDamageDetails: false,
    })
  },

  // 选择故障类型
  changeDamageType: function (e) {
    const damageType = e.currentTarget.dataset.damagetype;
    let damageList = this.data.damageList;
    let damageDetailLists = [];
    for (var i in damageList) {
      if (i == damageType) {
        damageDetailLists = damageList[i]
      }
    }
    this.setData({
      damageType: damageType,
      showDamageDetails: true,
      damageDetailLists: damageDetailLists
    })
  },

  // 重选故障，查看全部故障
  lookAllDamage: function () {
    this.setData({
      showDamageDetails: false
    })
  },

  // 选择故障详情
  damageDetail: function (e) {
    var index = e.target.dataset.index;
    var damageDescription = e.target.dataset.damagedescription;
    var damageName = e.target.dataset.damagename;
    var item_id = e.target.dataset.itemid;
    var price = e.target.dataset.price;
    var storePrice = e.target.dataset.storeprice;
    var damageDetailLists = this.data.damageDetailLists;
    var orderDetails = this.data.orderDetails;
    orderDetails.damage_items.push({
      item_id: item_id,
      storePrice: storePrice,
      price: price,
      damageName: damageName,
      damageDescription: damageDescription,
      stock: []
    });
    this.setData({
      orderDetails: orderDetails
    })
  },

  // 删除选中故障
  delDamage: function (e) {
    var index = e.currentTarget.dataset.index;
    var orderDetails = this.data.orderDetails;
    orderDetails.damage_items.splice(index, 1);
    this.setData({
      orderDetails: orderDetails
    })
  },


  // 关闭选择配件弹窗
  closeChangeParts: function () {
    this.setData({
      showStockDialog: false,
      showStockDetails: false
    })
  },

  //添加配件
  addStock: function (e) {
    this.setData({
      showStockDialog: true,
    });
    var index = e.currentTarget.dataset.index;
    var orderid = this.data.orderid;
    api.get_storeStockPartsType({ orderid: orderid }).then(res => {
      this.setData({
        stockList: res.result,
        curDamageIndex: index
      })
    });
  },

  //选择配件类型
  changepartsType: function (e) {
    var orderid = this.data.orderid;
    var index = e.currentTarget.dataset.index;
    var parts_type_id = e.currentTarget.dataset.partstypeid;
    var parts_type_name = e.currentTarget.dataset.partstypename;
    api.get_storeStockPartsList({ orderid: orderid, parts_type_id: parts_type_id }).then(res => {
      this.setData({
        stockDetailLists: res.result
      });
    });
    this.setData({
      showStockDetails: true
    });
  },

  // 选择配件详情
  partsDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var parts_id = e.currentTarget.dataset.partsid;
    var stockSn = e.currentTarget.dataset.stocksn;
    var stockName = e.currentTarget.dataset.stockname;
    var stockUnit = e.currentTarget.dataset.stockunit;
    var stockUse = 1;
    var stockAttr = e.currentTarget.dataset.stockattr;
    var stockGuarantee = e.currentTarget.dataset.stockguarantee;
    var orderDetails = this.data.orderDetails;
    var curDamageIndex = this.data.curDamageIndex;
    orderDetails.damage_items[curDamageIndex].stock.push({
      parts_id: parts_id,
      stockSn: stockSn,
      stockName: stockName,
      stockUnit: stockUnit,
      stockUse: stockUse,
      stockAttr: stockAttr,
      stockGuarantee: stockGuarantee
    });
    this.setData({
      orderDetails: orderDetails
    })
  },

  //重选配件
  lookAllparts: function () {
    this.setData({
      showStockDetails: false
    })
  },

  // 减少配件数量
  bindMinus: function (e) {
    var orderDetails = this.data.orderDetails;
    var index = e.currentTarget.dataset.index;
    var curDamageIndex = this.data.curDamageIndex;
    var stockUse = this.data.orderDetails.damage_items[curDamageIndex].stock[index].stockUse;
    // 如果大于1时，才可以减
    if (stockUse > 0) {
      stockUse--;
      this.data.orderDetails.damage_items[curDamageIndex].stock[index].stockUse = stockUse;
    }
    // 如果等于0时删除配件
    if (stockUse == 0) {
      orderDetails.damage_items[curDamageIndex].stock.splice(index, 1);
    }
    this.setData({
      orderDetails: orderDetails
    });
  },

  // 添加配件数量
  bindPlus: function (e) {
    var orderDetails = this.data.orderDetails;
    var index = e.currentTarget.dataset.index;
    var curDamageIndex = this.data.curDamageIndex;
    var stockUse = this.data.orderDetails.damage_items[curDamageIndex].stock[index].stockUse;
    stockUse++;
    this.data.orderDetails.damage_items[curDamageIndex].stock[index].stockUse = stockUse
    this.setData({
      orderDetails: orderDetails
    });
  },

  // 输入配件数量
  bindPartsNum: function (e) {
    var orderDetails = this.data.orderDetails;
    var index = e.currentTarget.dataset.index;
    var curDamageIndex = this.data.curDamageIndex;
    var stockUse = this.data.orderDetails.damage_items[curDamageIndex].stock[index].stockUse;
    var partsNum = e.detail.value;
    if (partsNum == 0) {
      this.data.orderDetails.damage_items[curDamageIndex].stock.splice(index, 1)
    }
    this.setData({
      orderDetails: orderDetails
    });
  },

  // 确认订单
  orderConfirm: function () {
    var orderid = this.data.orderid;
    api.orderConfirm({ orderid: orderid }).then(res => {
      this.getOrderDetails(orderid);
    });
  },


  //取消订单
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
    api.orderCause({ cancelCause: cancelCause, orderid: orderid }).then(res => {
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

  // 下一步
  orderNext: function () {
    var serviceStateNext = this.data.serviceStateNext;
    var orderid = this.data.orderid;
    var orderDetails = this.data.orderDetails;
    var warn = "";
    var flag = false;
    if (orderDetails.damage_items.length == 0) {
      warn = "请选择故障！";
    } else {
      flag = true;
      api.update_serviceState({ serviceState: serviceStateNext, orderid: orderid }).then(res => {
        this.getOrderDetails(orderid);
      });
    }

    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

  },

  // 查看评论
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

  // 确认已收款按钮提交
  confirmPay: function () {
    var orderid = this.data.orderid;
    api.update_orderPayState({ orderid: orderid }).then(res => {
      this.getOrderDetails(orderid);
    });
  },

  // 获取订单信息
  getOrderDetails: function (orderid) {
    api.orderDetails({ orderid: orderid }).then(res => {
      const { orderState, serviceState } = res.result;
      // 判断页面按钮显示隐藏
      const btnStateObj = {
        showConfirmOrderBtn: orderState == "10" && serviceState == "1",
        showConfirmPayCompleteBtn: orderState == "20" && serviceState == "20",
        showViewEvaluateBtn: orderState == "100" && serviceState == "20",
        showOrderStepBtn: orderState == "10" && serviceState == "2"
      }
      // 判断订单不同状态下故障显示隐藏
      const damageStateObj = {
        showConfirmOrderDamage: orderState == "10" && serviceState == "1",
        showRepairOrderDamage: orderState == "10" && serviceState == "2",
        showCompleteOrCancelDamage: orderState == "-1" || serviceState == "20"
      }
      // 计算实际支付金额
      const price = (res.result.orderPrice - res.result.couponPrice).toFixed(2);
      this.setData({
        orderDetails: res.result,
        damage_items: res.result.damage_items,
        serviceStateNext: res.result.serviceStateNext,
        price: price,
        btnStateObj: btnStateObj,
        damageStateObj: damageStateObj
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.orderid;
    this.setData({
      orderid: orderid
    });
    this.getOrderDetails(orderid);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var orderid = this.data.orderid;
    this.getOrderDetails(orderid);
  }
})