// pages/plan/plan.js
var app = getApp();
var flag = false;
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
    maskshow: false, //遮罩层
    quespop: false, //故障弹窗
    timepop: false, //时间弹框
    masterpop: false, //工程师傅弹框
    timeshow: true,
    timehide: false,
    yhshow: true,
    yhhide: false,
    curIndex: 0, //tab切换显示第几个
    yearmonth: [], //年月
    hours: [], //时间点
    servicetime: "", //上门时间
    name: "", //姓名
    tel: "", //联系方式
    display1: "block", //显示
    display2: "none", //隐藏
    colorarr: [], //颜色数组
    color: "", //选中颜色的值
    GetDateStr: "", //推算后几天时间
    value: [0, 0], //时间滚动值
    tabid: "", //tab切换标识
    combTampArr: [], //故障问题
    version: "", //手机型号
    system: '', //系统版本号
    price: "", //合计金额
    detailFailureArr: "",
    chooseFailureTitle: '', //选中的故障类型
    chooseFailureindex: -1, //选中哪个故障类型
    combList: '', //组合列表
    chooseFailureArr: '', //故障类型列表
    combArr: '', //组合列表
    workerlist: [], //工程师数组
    eng_id: "", //工程师id

    value2: [0], //工程师傅滚动值
    couponName: '', //优惠券名称
    couponPrice: 0, //优惠价格
    storename: "", //门店名称
    storeaddre: "", //门店地址
    storeid: "", //门店id
    worker: "",
    currentItem: "",
    province: "", //省
    city: "", //市
    area: "", //区	
    address: "", //详细地址
    typenum: "",
    remark: "", //备注
    couponid: 0, //优惠券id
    colorshow: true, //颜色是否展示
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {

    this.setData({
      token: app.globalData.userid,

    })
    this.timeway()
    var that = this
    wx.getStorage({
      key: 'order_data',
      success: function (res) {
        var version = res.data.version;
        //请求服务器获取数据获取机型颜色
        wx.request({
          url: app.globalData.serverUrl + 'Home/replaceModel',
          data: {
            model: version
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            console.log(res.data.data)
            var colorlength = res.data.data[0].color.length
            if (colorlength == 0) { //如果该机型没有颜色则不显示颜色版块
              that.setData({
                colorshow: false
              })
            } else {
              that.setData({
                colorarr: res.data.data[0].color
              })
            }

          },

        })
      }
    })

  },
  //弹窗取消按钮点击事件
  cancelbtn: function () {
    this.popclose()
    this.setData({

    })
  },
  //遮罩层点击事件
  maskhide: function () {
    this.popclose()
  },
  surebtn: function () {
    this.popclose()

  },
  //弹框及遮罩层关闭方法
  popclose: function () {
    this.setData({
      maskshow: false,
      quespop: false,
      timepop: false,
      masterpop: false,
      tag: false
    })
  },

  //故障弹框弹出
  gzbtn: function () {
    this.setData({
      maskshow: true, //遮罩层
      quespop: true, //故障弹窗 
    })
  },

  // 服务地址选择
  chooseaddre: function () {
    var that = this;

    //打开选择地址  
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        that.setData({

          noAddress: false,
          display1: "none",
          display2: "block",
          name: res.userName,
          tel: res.telNumber,
          province: res.provinceName, //省
          city: res.cityName, //市
          area: res.countyName, //区	
          address: res.detailInfo, //详细地址

        });
      },

      fail(res) {
        // wx.openSetting({})
      }
    })

  },

  //颜色选择
  tagChoose: function (e) {
    console.log(e)
    this.setData({
      colorid: e.currentTarget.dataset.num,
      color: e.currentTarget.dataset.color
    })
    this.otherway()

  },

  // 时间方法
  timeway: function () {
    var that = this
    var yearss = []
    var timess = []
    //循环显示多少天
    for (let i = 0; i <= 20; i++) {
      yearss.push(this.GetDateStr(i))
    }

    this.setData({
      yearmonth: yearss,

    })

    console.log(this.data.yearmonth[0])
    if (this.data.yearmonth[0] == now_day) {
      for (let i = 10; i <= 22; i++) {
        var i2 = i + 1
        if (i >= now_hour) {
          timess.push(i2 + ":00")
        }

      }

    }

    this.setData({
      hours: timess
    })
    this.otherway()
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
  //上门时间选择弹框
  timeclk: function () {
    this.setData({
      maskshow: true, //遮罩层
      timepop: true,
      tag: true
    })

  },
  // 上门时间确定按钮
  timesure: function () {

    this.popclose()
    var that = this
    var yearmonth = that.data.yearmonth
    var hours = that.data.hours
    var value = that.data.value

    // 将选择的城市信息显示到输入框
    var servicetime = that.data.yearmonth[value[0]] + "　" + that.data.hours[value[1]]
    that.setData({
      servicetime: servicetime,
      timehide: true,
      timeshow: false,
    })
    this.otherway()
  },

  //时间选择滑动事件
  bindChange: function (e) {
    var timess = [] //自定义小时空数组
    var val = e.detail.value
    if (this.data.yearmonth[val[0]] == now_day) {
      for (let i = 10; i <= 22; i++) {
        var i2 = i + 1
        if (i > now_hour) {
          timess.push(i2 + ":00")
        }
      }
    } else {

      for (let i = 10; i <= 22; i++) {

        timess.push(i + ":00")

      }
    }

    var value = e.detail.value
    var yearmonth = this.data.yearmonth
    var hours = this.data.hours

    var yearmonthNum = value[0]
    var hoursNum = value[1]

    this.setData({
      hours: timess,
      value: [yearmonthNum, hoursNum],
    })

  },

  //重选故障
  goindex: function () {
    var that = this
    wx.navigateBack({
      
    })

  },

  //tab切换事件
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);

    this.setData({
      curIndex: index,

    })
    this.otherway()
  },
  //备注
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  //上门维修
  visitgo: function (e) {
    console.log(e.currentTarget.dataset.door)
    var warn = "";
    var that = this;
    var flag = false;
    if (this.data.province == "") {
      warn = "请选择服务地址！";
    } else if (this.data.servicetime == "") {
      warn = "请选择上门时间！";
    } else {
      flag = true;

      wx.navigateTo({
        url: '../ordersuccess/ordersuccess'
        //？后面跟的是需要传递到下一个页面的参数

      });

    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabid: e.currentTarget.dataset.type,
      typenum: e.currentTarget.dataset.typenum,
      storeid: parseInt(e.currentTarget.dataset.door)
    })

    this.otherway()

  },

  //到店维修
  storego: function (e) {
    console.log(e.detail.value)

    var warn = "";
    var that = this;
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (that.data.storename == "请选择门店") {
      warn = "请选择门店！";
    } else {
      flag = true;

      wx.navigateTo({
        url: '../ordersuccess/ordersuccess'
        //？后面跟的是需要传递到下一个页面的参数

      });

    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabid: e.currentTarget.dataset.type,
      name: e.detail.value.name,
      tel: e.detail.value.tel,
      typenum: e.currentTarget.dataset.typenum
    })
    this.otherway()
  },

  //  邮寄维修
  yjgo: function (e) {
    console.log(e.currentTarget.dataset.typenum)
    var warn = "";
    var that = this;
    var flag = false;
    if (this.data.province == "") {
      warn = "请选择服务地址！";
    } else {
      flag = true;

      wx.navigateTo({
        url: '../ordersuccess/ordersuccess'
        //？后面跟的是需要传递到下一个页面的参数

      });

    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabid: e.currentTarget.dataset.type,
      typenum: e.currentTarget.dataset.typenum
    })

    this.otherway()
  },
  //存储本页面数据
  otherway: function () {
    var data = {
      model: this.data.model, //手机品牌
      version: this.data.version, //手机型号
      door_time: this.data.servicetime, //预约上门时间
      name: this.data.name, //姓名
      tel: this.data.tel, //联系方式
      dealer_id: this.data.storeid, //,门店id
      tabid: this.data.tabid, //类型
      typenum: this.data.typenum,
      color: this.data.color, //颜色         
      fault: this.data.combTampArr, //选中故障
      price: this.data.price,
      colorid: this.data.colorid,
      curIndex: this.data.curIndex,
      province: this.data.province, //省
      city: this.data.city, //市
      area: this.data.area, //区	
      address: this.data.address, //详细地址
      storename: this.data.storename,
      storeaddre: this.data.storeaddre,
      storeid: this.data.storeid,
      worker: this.data.worker, //工程师名称
      eng_id: this.data.eng_id, //工程师id
      remark: this.data.remark, //备注
      couponid: this.data.couponid //优惠券id
    }

    try {
      wx.setStorageSync('plan_data', data)
    } catch (e) {
      console.log("address页面的保存本地数据catch")
      console.log(e)
    }

  },

  //现场维修
  xianchanggo: function (e) {
    console.log(e.detail.value)
    var warn = "";
    var that = this;
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.storename == "") {
      warn = "请选择门店！";
    } else if (e.detail.value.worker == "请选择工程师傅") {
      warn = "请选择工程师傅！";
    } else {
      flag = true;

      wx.navigateTo({
        url: '../ordersuccess/ordersuccess'
        //？后面跟的是需要传递到下一个页面的参数

      });

    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
    this.setData({
      tabid: e.currentTarget.dataset.type,
      name: e.detail.value.name,
      tel: e.detail.value.tel,
      typenum: e.currentTarget.dataset.typenum

    })
    this.otherway()
  },
  // 工程师傅选择
  chooseworker: function () {
    this.setData({
      masterpop: true,
      maskshow: true, //遮罩层
    })
    //请求服务器获取数据
    var that = this
    var token = app.globalData.userid
    var storeid = that.data.storeid
    console.log(that.data.storeid)
    wx.request({
      url: app.globalData.serverUrl + 'Scheme/engineer',
      data: {
        token: token,
        dealer_id: storeid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        that.setData({
          workerlist: res.data.data
        })
      },

    })

  },
  workersure: function () {
    this.popclose()
    var that = this
    var value = that.data.value2
    var worker = that.data.workerlist[value[0]]

    // 将选择的城市信息显示到输入框
    that.setData({
      worker: worker.nickname,
      eng_id: worker.id
    })
    console.log(this.data.eng_id)
  },
  bindChangeworker: function (e) {
    const value = e.detail.value
    var workerNum = value[0]
    this.setData({
      value2: [workerNum],
    })

  },

  //优惠券选择
  couponclk: function () {
    wx.navigateTo({
      url: '../coupon/coupon?currentItem=' + this.data.currentItem,
    })

  },
  //门店选择
  tochoosestore: function () {
    wx.navigateTo({
      url: '../store/store'
    });
    this.otherway()
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
    // 页面显示
    var that = this;
    //获取本地下单对象信息
    wx.getStorage({
      key: 'order_data',
      success: function (res) {
        console.log(res)
        that.setData({
          price: res.data.price,
          model: res.data.model,
          version: res.data.version,
          combTampArr: res.data.combTampArr,
          model: res.data.model
        })
      }
    })
    wx.getStorage({
      key: 'coupon_data',
      success: function (res) {

        that.setData({
          couponName: res.data.couponName,
          couponPrice: res.data.couponPrice,
          currentItem: res.data.currentItem,
          couponid: res.data.couponid,
        })
      }
    })
    wx.getStorage({
      key: 'store_data',
      success: function (res) {
        that.setData({
          storename: res.data.storename,
          storeaddre: res.data.storeaddre,
          storeid: res.data.storeid,
        })
      },
    })
    wx.getStorage({
      key: 'plan_data',
      success: function (res) {
        that.setData({

          colorid: res.data.colorid,
          curIndex: res.data.curIndex,

        })
      },
    })

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