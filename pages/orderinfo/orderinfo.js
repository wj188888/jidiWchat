// pages/orderinfo/orderinfo.js
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    reson_items: [], //取消订单原因组合
    tabid: "", //订单类型
    ordernum: '', //订单编号
    order_price: "", //订单金额
    mobileModel: '', //自动获取手机型号
    name: "",
    tel: "",
    order_id: "",
    coupon: "", //优惠券
    maskshow: false,
    groupshow: false,
    visti_show: false,
    gostore_show: false,
    yj_show: false,
    xc_show: false,
    leavewords: "",
    order_id: "",
    status: "", //订单状态
    model: "", //品牌
    version: "", //型号
    add_time: "", //下单时间
    actual_price: "", //实际支付
    fault: [], //故障
    door_time: "", //上门时间
    province: "", //省
    city: "", //市
    area: "", //区
    address: "", //地址
    dea_nickname: "", //门店名称
    dea_mobile: "", //门店电话
    dea_address: "", //门店地址
    eng_name: "", //工程师
    cancel_reason: "",
    remark: "",
    remark2: "",
    cancelbtnshow: true,
    paybtnshow: true,
    rensonshow: false,
    cancel_reason: "",
  },
  //时间戳转换时间  
  toDate: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    console.log(options)
    var that = this;

    this.setData({
      order_id: options.order_id,
      status: options.status,
      rensonshow: options.rensonshow
    })
    wx.setStorage({
      key: 'order_id',
      data: options.order_id,
    })

    var token = app.globalData.userid

    //请求服务器获取数据
    wx.request({
      url: app.globalData.serverUrl + 'Order/details',
      data: {
        token: token,
        order_id: options.order_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({
          status: res.data.data.status,
          ordernum: res.data.data.order_sn,
          model: res.data.data.model,
          version: res.data.data.version,
          tabid: res.data.data.type,
          add_time: that.toDate(res.data.data.add_time),
          order_price: res.data.data.order_price,
          coupon: res.data.data.coupon,
          actual_price: res.data.data.actual_price,
          name: res.data.data.nickname,
          tel: res.data.data.mobile,
          door_time: res.data.data.door_time,
          province: res.data.data.province, //省
          city: res.data.data.city, //市
          area: res.data.data.area, //区
          address: res.data.data.address, //地址
          dea_address: res.data.data.dea_address, //门店地址
          eng_name: res.data.data.eng_name, //工程师
          dea_nickname: res.data.data.dea_nickname, //门店名称
          dea_mobile: res.data.data.dea_mobile, //门店电话
          remark: res.data.data.remark,
          cancel_reason: res.data.data.cancel_reason
        })

        if (res.data.data.status == 1) {

          that.setData({

            status: "下单未支付",
            groupshow: true,
            paybtnshow: false,
          })
        }
        if (res.data.data.status == 2) {
          if (res.data.data.pay_time == null) {
            that.setData({
              groupshow: true,
              paybtnshow: true,
            })
          } else {
            that.setData({
              paybtnshow: false,
            })
          }
          that.setData({
            status: "维修中",
            cancelbtnshow: false
          })
        }
        if (res.data.data.status == 3) {
          that.setData({
            status: "已完成",

          })
        }
        if (res.data.data.status == 4) {
          that.setData({

            status: "已取消",
            rensonshow:true,
          })
        }

        if (res.data.data.type == 1) {
          that.setData({
            visti_show: true,
            tabid: "上门维修"

          })
        }
        if (res.data.data.type == 2) {
          that.setData({
            gostore_show: true,
            tabid: "到店维修"
          })
        }
        if (res.data.data.type == 3) {
          that.setData({
            yj_show: true,
            tabid: "邮寄维修"
          })
        }
        if (res.data.data.type == 4) {
          that.setData({
            xc_show: true,
            tabid: "现场维修"
          })
        }

      },

    })

  },
  surebtn: function () {
    this.setData({
      maskshow: false,

    })
  },
  //单选
  radioChange: function (e) {
    console.log(e.detail.value)
  },
  //备注
  bindTextAreaBlur: function (e) {
    console.log(e)
    this.setData({
      remark2: e.detail.value
    })
  },

  //取消订单
  cancelorder: function () {
    var that = this

    that.setData({
      maskshow: true,

    })

    var token = app.globalData.userid

    //请求服务器获取数据
    wx.request({
      url: app.globalData.serverUrl + 'Order/cancelReason',
      data: {
        token: token,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          reson_items: res.data.data
        })

      },

    })

    console.log(this.data.reson_items)
  },
  surebtn: function () {

    var that = this
    var token = app.globalData.userid
    var order_id = this.data.order_id
    var cancel_reason = this.data.cancel_reason
    var remark2 = this.data.remark2
    console.log(remark2)
    if (cancel_reason == "") {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请选择取消订单的原因"
      })
    } else {
      //请求服务器获取数据
      wx.request({
        url: app.globalData.serverUrl + 'Order/cancelOrder',
        data: {
          token: token,
          order_id: order_id,
          cancel: cancel_reason + remark2,

        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            maskshow: false,
            rensonshow: true
          })
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 2000
          })
         
         
          wx.redirectTo({
            url: '../orderinfo/orderinfo?order_id=' + that.data.order_id + '&rensonshow=' + that.data.rensonshow ,
          })
        },

      })

    }

  },
  maskhide: function () {
    this.setData({
      maskshow: false,

    })
  },
  // 支付
  paybtn: function () {
    var token = app.globalData.userid
    var order_id = this.data.order_id

    //请求服务器获取数据
    wx.request({
      url: app.globalData.serverUrl + 'Order/payOrder',
      data: {
        token: token,
        order_id: order_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (res) {
            console.log(res)
            console.log(res)
            if (res.errMsg == "requestPayment:ok") { // 调用支付成功
              wx.redirectTo({
                url: '../orderinfo/orderinfo?order_id=' + that.data.order_id, // 成功后的处理，可以跳转，也可以根据自己的需要做其他处理
              })
            } else if (res.errMsg == 'requestPayment:cancel') {　　　　　　 // 用户取消支付的操作
            }
          },
          'fail': function (res) { },
          'complete': function (res) {

          }
        })
      },

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