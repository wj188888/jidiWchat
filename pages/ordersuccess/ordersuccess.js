// pages/ordersuccess/ordersuccess.js
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    tabid: "", //订单类型
    order_sn: "", //订单编号
    order_id: "", //订单id
    price: "", //价格 
    door_time: "", //上门时间
    model: "",
    version: "",
    nickname: "",
    dealer_id: "",
    eng_id: "", //工程师
    remark: "", //备注
    gostore_show: false, //到店
    goHome_show: false, //上门
    jy_show: false, //邮寄
    xc_show: false, //现场
    service_date: "", //营业时间
    storetel: "", //门店电话
    store_address: "", //返回的门店地址
    storeaddre: "", //自己选择的门店地址
    province: "",
    city: "",
    area: "",
    address: "",
    worker: "",
    typenum: "", //类型
    service_date: "", //服务时间
  },

	/**
	 * 生命周期函数--监听页面加载
	 * 
	 */
  unid: function (arr) {
    var arr1 = []
    for (var i = 0; i < arr.length; i++) {
      arr1[i] = arr[i]['ChooseFailureid']
    }
    return arr1
  },

  onLoad: function (options) {

    var that = this;
    //获取存储信息
    wx.getStorage({
      key: 'plan_data',
      success: function (res) {
        // success
        console.log(res.data)
        that.setData({
          tabid: res.data.tabid,
          price: res.data.price,
          name: res.data.name,
          tel: res.data.tel,
          province: res.data.province,
          city: res.data.city,
          area: res.data.area,
          address: res.data.address,
          door_time: res.data.door_time,
          storeaddre: res.data.storeaddre,
          eng_id: res.data.eng_id,
          worker: res.data.worker,
          typenum: res.data.typenum,
          model: res.data.model,
          remark: res.data.remark,
          couponid: res.data.couponid

        })
        if (res.data.tabid == "上门维修") {
          that.setData({
            gohome_show: true,

          })
        }
        if (res.data.tabid == "到店维修") {
          that.setData({
            gostore_show: true,

          })
        }
        if (res.data.tabid == "邮寄维修") {
          that.setData({
            yj_show: true,

          })
        }
        if (res.data.tabid == "现场维修") {
          that.setData({
            xc_show: true,

          })
        }

        var token = app.globalData.userid
        var fault = that.unid(res.data.fault)
        console.log(fault)
        //请求服务器获取数据
        wx.request({
          url: app.globalData.serverUrl + 'Scheme/placeOrder',
          data: {
            token: token,
            model: res.data.model,
            version: res.data.version,
            door_time: res.data.door_time,
            type: res.data.typenum,
            color: res.data.color,
            fault: fault,
            province: res.data.province,
            city: res.data.city,
            area: res.data.area,
            dealer_id: res.data.storeid,
            nickname: res.data.name,
            mobile: res.data.tel,
            remark: res.data.remark,
            coupon: res.data.couponid,
            address: res.data.address,
            eng_id: res.data.eng_id,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res)
            that.setData({
              order_sn: res.data.data.order_sn,
              order_id: res.data.data.order_id,
              storeaddre: res.data.data.address,
              storetel: res.data.data.mobile,
              storename: res.data.data.nickname,
              service_date: res.data.data.service_date
            })

          },

        })

      }
    })

  },
  // 查看订单
  seeorder: function () {
    wx.navigateTo({
      url: '../orderinfo/orderinfo?order_id=' + this.data.order_id,

    })
    wx.removeStorage({
      key: 'order_data',

    })
    wx.removeStorage({
      key: 'coupon_data',

    })
    wx.removeStorage({
      key: 'store_data',

    })

  },
  goindex: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../index/index',

    })
    wx.removeStorage({
      key: 'order_data',
      success: function (res) {

      }
    })
    wx.removeStorage({
      key: 'coupon_data',

    })
    wx.removeStorage({
      key: 'store_data',

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