// pages/plan/plan.js
const api = require('../../utils/API.js');
var app = getApp();
var dd = new Date()
var now_hour = dd.getHours(); //获取当前小时
var y = dd.getFullYear();
var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
var now_day = y + "-" + m + "-" + d; //当前年月日
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobileInfo: {},//手机品牌和类型
    orderPrice: "",//订单金额
    curIndex: 0, //tab切换显示第几个
    tabtype: "",//tab类型
    typenum: "",
    faultmask: false,//故障列表蒙层
    faultdialogshow: false,//故障列表弹窗
    mobile_id: "",//手机型号id
    item_ids: "",//故障id
    orderDetails: [],//订单详情
    faultDetails: [],//故障列表
    tips: {},//维修方式提示文字
    tips1Arr: [],
    tips2Arr: [],
    tips3Arr: [],
    tips4Arr: [],

    display1: "block", //服务地址显示
    display2: "none", //服务地址隐藏
    provinceName: "", //省
    cityName: "", //市
    countyName: "", //区	
    detailInfo: "", //详细地址
    nationalCode: "",
    postalCode: "",
    telNumber: "",//联系方式
    userName: "",//姓名
    address: {},//地址

    dialogtimeshow: false,//上门时间弹窗
    timemaskshow: false,//上门时间蒙层
    GetDateStr: "", //推算后几天时间
    yearmonth: [], //年月
    hours: [], //时间点
    value: [0, 0], //时间滚动值
    onsiteTime: "", //上门时间

    cname: "",//姓名 到店维修
    tel: "",//联系电话 到店维修

    storename: '',//门店名称
    storeaddre: '',//门店地址
    storetime: '',//门店服务时间
    serviceTel: '',//门店服务电话
    storeid: '',//门店ID

    dialogworkershow: false,//工程师弹窗
    workermaskshow: false,//工程师蒙层
    workerlist: [],//工程师列表
    value2: [0], //工程师傅滚动值
    worker: '',//工程师
    engineer_id: '',//工程师id

    remark: '',//备注
    orderid: '',//订单号

    displayinput: true,//多行文本层级问题
    inputPadding: false,//文本框输入问题
  },

  // 重选故障 返回首页
  goindex: function () {
    wx.navigateBack({
      url: '../pageIndex/pageIndex',
    })
  },

  // 显示故障列表
  gzbtn: function () {
    this.setData({
      faultmask: true,
      faultdialogshow: true,
      displayinput: false
    })
  },
  // 隐藏故障列表
  displayfault: function () {
    this.setData({
      faultmask: false,
      faultdialogshow: false,
      displayinput: true
    })
  },
  // 点击蒙层关闭故障列表 弹窗
  faultmaskhide: function () {
    this.displayfault();
  },
  // 关闭故障列表弹窗
  cancelfaultbbtn: function () {
    this.displayfault();
  },

  //tab切换事件 选择维修方式
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index,
    })
    this.otherway();
  },

  // 服务地址选择
  chooseaddre: function () {
    //打开选择地址 
    wx.chooseAddress({
      success: (res) => {
        var address = {
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          nationalCode: res.nationalCode,
          postalCode: res.postalCode,
          provinceName: res.provinceName,
          telNumber: res.telNumber,
          userName: res.userName
        }
        this.setData({
          noAddress: false,
          display1: "none",
          display2: "block",
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          nationalCode: res.nationalCode,
          postalCode: res.postalCode,
          provinceName: res.provinceName,
          telNumber: res.telNumber,
          userName: res.userName,
          address: address
        });
      }
    });
  },

  // 上门时间选择弹窗
  timeclk: function () {
    this.setData({
      dialogtimeshow: true,
      timemaskshow: true,
      displayinput: false
    });
  },
  // 隐藏上门时间弹窗
  displaytime: function () {
    this.setData({
      dialogtimeshow: false,
      timemaskshow: false,
      displayinput: true
    })
  },
  // 取消上门时间选择
  cancelvisitbtn: function () {
    this.displaytime();
  },
  // 时间方法
  timeway: function () {
    var yearss = []
    var timess = []
    //循环显示多少天
    for (let i = 0; i <= 20; i++) {
      yearss.push(this.GetDateStr(i))
    }
    this.setData({
      yearmonth: yearss,
    })
    if (this.data.yearmonth[0] == now_day) {
      for (let i = 10; i <= 22; i++) {

        var time = i;
        if (i > now_hour) {
          timess.push(time + ":00")
        }
      }
    }
    this.setData({
      hours: timess
    })
    this.otherway();
  },
  //展示当天时间之后n天的时间
  GetDateStr: function (AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    var x = dd.getDay();
    return y + "-" + m + "-" + d + ''.charAt(dd.getDay());

  },
  // 确定上门时间选择
  changevisitsure: function () {
    this.displaytime();
    var yearmonth = this.data.yearmonth
    var hours = this.data.hours
    var value = this.data.value
    // 将选择的城市信息显示到输入框
    var onsiteTime = this.data.yearmonth[value[0]] + " " + this.data.hours[value[1]]
    this.setData({
      onsiteTime: onsiteTime,
    })
    this.otherway();
  },
  // 点击蒙层隐藏上门时间弹窗
  timemaskhide: function () {
    this.displaytime();
  },
  //时间选择滑动事件
  bindChange: function (e) {
    var timess = [] //自定义小时空数组
    var value = e.detail.value;
    var yearmonth = this.data.yearmonth;
    var hours = this.data.hours;

    if (this.data.yearmonth[value[0]] == now_day) {
      for (let i = 10; i <= 22; i++) {
        var time = i;
        if (i > now_hour) {
          timess.push(time + ":00")
        }
      }
    } else {
      for (let i = 10; i <= 22; i++) {
        timess.push(i + ":00")
      }
    }
    var yearmonthNum = value[0];
    var hoursNum = value[1];
    this.setData({
      hours: timess,
      value: [yearmonthNum, hoursNum],
    })
  },

  //优惠券选择
  couponclk: function () {
    // wx.navigateTo({
    //   url: '../coupon/coupon'
    // })
  },
  //门店选择
  tochoosestore: function () {
    // 跳转至门店选择页面
    wx.navigateTo({
      url: '../store/store'
    });
    var data = {
      item_ids: this.data.item_ids
    }
    wx.setStorageSync('fault_ids', data)
    this.otherway()
  },

  // 工程师选择 显示弹窗
  chooseworker: function () {
    this.setData({
      dialogworkershow: true,
      workermaskshow: true,
      displayinput: false
    });
    // 获取工程师列表
    var store_id = this.data.storeid;
    api.engineer({ store_id: store_id }).then(res => {
      this.setData({
        workerlist: res.result
      })
    })
  },
  // 隐藏工程师弹窗
  displayworker: function () {
    this.setData({
      dialogworkershow: false,
      workermaskshow: false,
      displayinput: true
    })
  },
  // 取消工程师选择
  cancelworkerbtn: function () {
    this.displayworker();
  },
  // 确定选择工程师
  changeworkersure: function () {
    this.displayworker();
    var value = this.data.value2
    var worker = this.data.workerlist[value[0]]
    // 将选择的城市信息显示到输入框
    this.setData({
      worker: worker.engineerName,
      engineer_id: worker.id
    })
  },
  // 点击蒙层隐藏工程师选择弹窗
  workermaskhide: function () {
    this.displayworker();
  },
  // 工程师选择滑动事件
  bindChangeworker: function (e) {
    const value = e.detail.value
    var workerNum = value[0]
    this.setData({
      value2: [workerNum]
    })
  },
  //备注
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  // 备注文本获取焦点
  inputfocus: function () {
    this.setData({
      inputPadding: true
    }, () => {
      // 页面滚动至底部
      this.pageScrollToBottom();
    });

  },
  // 备注文本失去焦点
  inputBlur: function () {
    this.setData({
      inputPadding: false
    });
  },
  // 到店维修 联系人姓名
  cnameInput: function (e) {
    this.setData({
      cname: e.detail.value
    })
  },
  // 到店维修 联系人电话
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 上门维修 立即维修
  visitgo: function (e) {
    var tabtype = e.currentTarget.dataset.type;
    var typenum = e.currentTarget.dataset.typenum;
    var warn = "";
    var flag = false;
    if (this.data.provinceName == "") {
      warn = "请选择服务地址！";
    } else if (this.data.onsiteTime == "") {
      warn = "请选择上门时间！";
    } else {
      flag = true;
      var params = {
        serviceType: 1,
        mobile_id: this.data.mobile_id,
        item_ids: this.data.item_ids,
        address: this.data.address,
        onsiteTime: this.data.onsiteTime,
        remark: this.data.remark,
      }
      api.create_order(params).then(res => {
        // 上门维修下单成功
        this.setData({
          orderid: res.result.orderid
        }, () => {
          this.otherway();
          wx.redirectTo({
            url: '../ordersuccess/ordersuccess',
          });
        })
      });
    }

    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabtype: tabtype,
      typenum: typenum
    })
    this.otherway();
  },
  // 到店维修 立即维修
  arrivalgo: function (e) {
    var tabtype = e.currentTarget.dataset.type;
    var typenum = e.currentTarget.dataset.typenum;
    var warn = "";
    var flag = false;
    if (this.data.cname == "") {
      warn = "请填写您的姓名！";
    } else if (this.data.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(this.data.tel))) {
      warn = "手机号格式不正确";
    } else if (this.data.storename == "") {
      warn = "请选择门店！";
    } else {
      flag = true;
      var params = {
        serviceType: 2,
        mobile_id: this.data.mobile_id,
        item_ids: this.data.item_ids,
        cname: this.data.cname,
        tel: this.data.tel,
        store_id: this.data.storeid,
        remark: this.data.remark,
      }
      api.create_order(params).then(res => {
        // 到店维修下单成功
        this.setData({
          orderid: res.result.orderid
        }, () => {
          this.otherway();
          wx.redirectTo({
            url: '../ordersuccess/ordersuccess',
          });
        })
      });
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabtype: tabtype,
      typenum: typenum
    })
    this.otherway();
  },
  // 邮寄维修 立即维修
  mailgo: function (e) {
    var tabtype = e.currentTarget.dataset.type;
    var typenum = e.currentTarget.dataset.typenum;
    var warn = "";
    var flag = false;
    if (this.data.provinceName == "") {
      warn = "请选择服务地址！";
    } else if (this.data.storename == "") {
      warn = "请选择门店！";
    } else {
      flag = true;
      var params = {
        serviceType: 3,
        store_id: this.data.storeid,
        mobile_id: this.data.mobile_id,
        item_ids: this.data.item_ids,
        address: this.data.address,
        remark: this.data.remark
      }
      api.create_order(params).then(res => {
        // 邮寄维修下单成功
        this.setData({
          orderid: res.result.orderid
        }, () => {
          this.otherway();
          wx.redirectTo({
            url: '../ordersuccess/ordersuccess',
          });
        })
      });
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabtype: tabtype,
      typenum: typenum
    })
    this.otherway();
  },
  // 现场维修 立即维修
  spotgo: function (e) {
    var tabtype = e.currentTarget.dataset.type;
    var typenum = e.currentTarget.dataset.typenum;
    var warn = "";
    var flag = false;
    if (this.data.cname == "") {
      warn = "请填写您的姓名！";
    } else if (this.data.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(this.data.tel))) {
      warn = "手机号格式不正确";
    } else if (this.data.storename == "") {
      warn = "请选择门店！";
    } else if (this.data.worker == "") {
      warn = "请选择工程师！";
    } else {
      flag = true;
      var params = {
        serviceType: 4,
        store_id: this.data.storeid,
        mobile_id: this.data.mobile_id,
        item_ids: this.data.item_ids,
        cname: this.data.cname,
        tel: this.data.tel,
        engineer_id: this.data.engineer_id,
        remark: this.data.remark
      }
      api.create_order(params).then(res => {
        // 现场维修下单成功
        this.setData({
          orderid: res.result.orderid
        }, () => {
          this.otherway();
          wx.redirectTo({
            url: '../ordersuccess/ordersuccess',
          });
        })
      });
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabtype: tabtype,
      typenum: typenum
    })
    this.otherway();
  },
  //存储本页面数据
  otherway: function () {
    var data = {
      tabtype: this.data.tabtype,
      typenum: this.data.typenum,
      curIndex: this.data.curIndex,
      orderid: this.data.orderid,
      mobileInfo: this.data.mobileInfo, //手机品牌和型号
      faultDetails: this.data.faultDetails, //选中故障
      orderPrice: this.data.orderPrice,//订单价格
      address: this.data.address,//地址
      onsiteTime: this.data.onsiteTime, //预约上门时间
      cname: this.data.cname, //姓名
      tel: this.data.tel, //联系方式
      storeid: this.data.storeid, //门店id
      storename: this.data.storename,
      storeaddre: this.data.storeaddre,
      storetime: this.data.storetime,
      serviceTel: this.data.serviceTel,
      worker: this.data.worker, //工程师名称
      engineer_id: this.data.engineer_id, //工程师id
      remark: this.data.remark, //备注
    }
    wx.setStorageSync('plan_data', data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timeway();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取手机品牌和故障基本信息
    wx.getStorage({
      key: 'order_data',
      success: (res) => {
        this.setData({
          mobile_id: res.data.mobile_id,
          item_ids: res.data.item_ids
        });
        // 获取手机品牌型号以及故障详情
        var mobile_id = this.data.mobile_id;
        var item_ids = this.data.item_ids;
        api.confirm_order({ mobile_id: mobile_id, item_ids: item_ids }).then(res => {
          var orderDetails = res.result.order_details;
          var faultDetails = [];
          for (var i = 0; i < orderDetails.length; i++) {
            for (var j = 0; j < orderDetails[i].children.length; j++) {
              faultDetails.push(orderDetails[i].children[j])
            }
          }
          this.setData({
            orderPrice: res.result.order_price,
            mobileInfo: res.result.mobile_info,
            orderDetails: res.result.order_details,
            tips: res.result.tips,
            faultDetails: faultDetails
          });
          var tips1 = this.data.tips.tips_serviceType1;
          var tips2 = this.data.tips.tips_serviceType2;
          var tips3 = this.data.tips.tips_serviceType3;
          var tips4 = this.data.tips.tips_serviceType4;
          var tips1Arr = [];
          var tips2Arr = [];
          var tips3Arr = [];
          var tips4Arr = [];
          if (tips1.indexOf("\n") >= 0) {
            tips1Arr = tips1.split("\n");
          }
          if (tips2.indexOf("\n") >= 0) {
            tips2Arr = tips2.split("\n");
          }
          if (tips3.indexOf("\n") >= 0) {
            tips3Arr = tips3.split("\n");
          }
          if (tips4.indexOf("\n") >= 0) {
            tips4Arr = tips4.split("\n");
          }
          this.setData({
            tips1Arr: tips1Arr,
            tips2Arr: tips2Arr,
            tips3Arr: tips3Arr,
            tips4Arr: tips4Arr,
          })
        })
      },
    });
    // 获取选中门店
    wx.getStorage({
      key: 'store_data',
      success: (res) => {
        this.setData({
          storename: res.data.storename,
          storeaddre: res.data.storeaddre,
          storeid: res.data.storeid,
          storetime: res.data.storetime,
          serviceTel: res.data.serviceTel,
          worker: ""
        })
      },
    })
  },
  // 页面滚动到底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#container').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  }
})