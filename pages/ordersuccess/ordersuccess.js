// pages/ordersuccess/ordersuccess.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gostore_show: false, //到店
    goHome_show: false, //上门
    jy_show: false, //邮寄
    xc_show: false, //现场
    tabtype: "",//维修类型
    typenum: "",
    orderid: "",//订单号
    mobileInfo: {}, //手机品牌和型号
    faultDetails: [], //选中故障
    orderPrice: "",//订单价格
    address: "",//地址
    onsiteTime: "", //预约上门时间
    cname: "", //姓名
    tel: "", //联系方式
    storeid: "", //门店id
    storename: "",//门店名称
    storeaddre: "",//门店地址
    storetime: "",//服务时间
    serviceTel: "",//服务电话
    worker: "", //工程师名称
    engineer_id: "", //工程师id
    remark: "", //备注
  },
  /**
  * 返回首页
  */
  goindex: function (e) {
    wx.navigateBack({
      url: '../pageIndex/pageIndex',
      delta:100
    });
  },
  /**
   * 查看订单详情
   */
  seeorder: function () {
    wx.navigateTo({
      url: '../userorderdetails/userorderdetails?orderid=' + this.data.orderid,//第二版
      // url: '../orderinfo/orderinfo?orderid=' + this.data.orderid,//第一版
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单信息
    wx.getStorage({
      key: 'plan_data',
      success: (res)=> {
        this.setData({
          tabtype: res.data.tabtype,//维修类型
          typenum: res.data.typenum,
          orderid: res.data.orderid,//订单号
          mobileInfo: res.data.mobileInfo, //手机品牌和型号
          faultDetails: res.data.faultDetails, //选中故障
          orderPrice: res.data.orderPrice,//订单价格
          address: res.data.address,//地址
          onsiteTime: res.data.onsiteTime, //预约上门时间
          cname: res.data.cname, //姓名
          tel: res.data.tel, //联系方式
          storeid: res.data.storeid, //门店id
          storename: res.data.storename,//门店名称
          storeaddre: res.data.storeaddre,//门店地址
          storetime: res.data.storetime,//门店服务时间
          serviceTel: res.data.serviceTel,//门店服务电话
          worker: res.data.worker, //工程师名称
          engineer_id: res.data.engineer_id, //工程师id
          remark: res.data.remark, //备注
        });
        // 判断服务信息的显示
        if (res.data.typenum == "1") {
          this.setData({
            gostore_show: true,
          })
        }
        if (res.data.typenum == "2") {
          this.setData({
            goHome_show: true,
          })
        }
        if (res.data.typenum == "3") {
          this.setData({
            jy_show: true,
          })
        }
        if (res.data.typenum == "4") {
          this.setData({
            xc_show: true,
          })
        }
      }
    })
  }
})