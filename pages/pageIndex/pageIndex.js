// pages/pageIndex/pageIndex.js
var app = getApp();
const api = require('../../utils/API.js');
import config from "../../config.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",//用户头像
    nickname: '',//用户名
    userinfobtn: false,
    banner: [],//轮播图
    interval: 5000,
    duration: 1000,
    autoplay: true,

    mobilepic: "",//手机图片
    phoneModel: "",//手机型号
    version: "",//版本
    showChangeIphone: false,//判断是默认还是选择手机

    mobileData: [],//手机品牌型号缓存
    mobileList: [],//手机品牌和型号
    curPhoneBrandIndex: 0,//当前选中的手机品牌
    curPhonemodalIndex: 0,//当前选中的手机型号
    value: [0, 0],//选中的手机品牌和型号
    mobileId: '',//手机型号id
    dialogshow: false,//手机型号弹窗
    maskshow: false,//手机型号蒙层

    mobileDamageList: [],//手机故障列表
    detailFailureFlag: false,//手机故障弹窗蒙层
    dialogdetailFailureshow: false,//手机故障弹窗
    curPhoneFaultIndex: 0,//当前选中的手机型号
    faultDetailList: [],//故障详情列表
    combTampArrTotal: [],//选中故障详情
    itemids: "",//选中故障id
    totalPrice: '',//维修价格

    demageUrl: ''//故障背景图片路径
  },

  // 跳转到个人中心页面
  toperson: function () {
    if (wx.getStorageSync("userInfo")) {
      wx.navigateTo({
        url: '../newPerson/newPerson',
      })
      // wx.navigateTo({
      //   url: '../person/person',
      // })
    }
  },
  // 更换手机型号 新页面
  changeMobile: function () {
    wx.navigateTo({
      url: '../getmodel/getmodel',
    })
  },

  // 手机故障弹窗隐藏
  failuredialog: function () {
    this.setData({
      detailFailureFlag: false,
      dialogdetailFailureshow: false
    })
  },
  // 显示手机故障弹窗
  showPhoneFaultList: function (e) {
    var mobileDamageList = this.data.mobileDamageList;
    // 当前选中故障类型
    var index = e.currentTarget.dataset.id; //故障类型id
    // 获取故障详情
    var faultDetailArr = this.data.mobileDamageList[index].children;
    this.setData({
      detailFailureFlag: true,
      dialogdetailFailureshow: true,
      curPhoneFaultIndex: index,
      faultDetailList: faultDetailArr
    })
  },
  // 点击蒙层 隐藏手机故障弹窗
  questionmaskhide: function () {
    this.failuredialog();
    var combTampArrTotal = this.data.combTampArrTotal;
    var curPhoneFaultIndex = this.data.curPhoneFaultIndex;
    var faultDetailList = this.data.faultDetailList;
    var faultDetailArr = this.data.mobileDamageList[this.data.curPhoneFaultIndex].children;
    combTampArrTotal[curPhoneFaultIndex] = [];
    // 取消故障详情选中样式
    for (var i = 0; i < faultDetailList.length; i++) {
      faultDetailArr[i].pitch = false;
    }
    this.setData({
      combTampArrTotal: combTampArrTotal,
      faultDetailList: faultDetailArr
    })
    this.price();
  },
  // 选择故障种类 故障详情
  faultDetail: function (e) {
    var index = e.target.dataset.index;
    var faultDetailList = this.data.faultDetailList;
    var combTampArrTotal = this.data.combTampArrTotal;
    var curPhoneFaultIndex = this.data.curPhoneFaultIndex;
    var faultDetailArr = this.data.mobileDamageList[this.data.curPhoneFaultIndex].children;

    for (var i = 0; i < faultDetailList.length; i++) {
      if (i == index) {
        // 设置选中故障样式
        faultDetailArr[index].pitch = !faultDetailArr[index].pitch;
        this.setData({
          faultDetailList: faultDetailArr
        })
        // 添加故障详情至故障临时数组
        if (faultDetailArr[i].pitch) {
          combTampArrTotal[curPhoneFaultIndex].push(faultDetailArr[i])
        } else {
          for (var j = 0; j < combTampArrTotal[curPhoneFaultIndex].length; j++) {
            if (faultDetailArr[i].item_id == combTampArrTotal[curPhoneFaultIndex][j].item_id) {
              combTampArrTotal[curPhoneFaultIndex].splice(j, 1);
            }
          }
        }
        this.setData({
          combTampArrTotal: combTampArrTotal,
        })
      } else {
        faultDetailList[i].pitch = false;
      }
      wx.setStorageSync("mobileDamageList", this.data.mobileDamageList)
    }
    this.price();
  },
  // 取消手机故障选择
  cancelprobbtn: function () {
    this.failuredialog();
    var combTampArrTotal = this.data.combTampArrTotal;
    var curPhoneFaultIndex = this.data.curPhoneFaultIndex;
    var faultDetailList = this.data.faultDetailList;
    var faultDetailArr = this.data.mobileDamageList[this.data.curPhoneFaultIndex].children;
    combTampArrTotal[curPhoneFaultIndex] = [];
    // 取消故障详情选中样式
    for (var i = 0; i < faultDetailList.length; i++) {
      faultDetailArr[i].pitch = false;
    }
    this.setData({
      combTampArrTotal: combTampArrTotal,
      faultDetailList: faultDetailArr
    })
    this.price();
  },
  // 确定手机故障选择
  changeprobsure: function () {
    this.failuredialog();
    var faultDetailList = this.data.faultDetailList;
    var combTampArrTotal = this.data.combTampArrTotal;
    this.setData({
      faultDetailList: faultDetailList,
      combTampArrTotal: combTampArrTotal
    }, () => {
      this.price();
    })
  },
  //统计维修价格
  price: function () {
    var combTampArrTotal = this.data.combTampArrTotal;
    var price = 0;
    for (var i = 0; i < combTampArrTotal.length; i++) {
      for (var j = 0; j < combTampArrTotal[i].length; j++) {
        price = price + parseFloat(combTampArrTotal[i][j].price);
      }
    }
    this.setData({
      totalPrice: price
    })
  },

  // 立即预约 跳转到维修方案选择页面
  goplan: function () {
    var mobileId = this.data.mobileId;
    var itemids = this.data.itemids;
    var combTampArrTotal = this.data.combTampArrTotal;
    var itemidStr = "";
    var itemidstr = "";
    for (var i = 0; i < combTampArrTotal.length; i++) {
      for (var j = 0; j < combTampArrTotal[i].length; j++) {
        itemidStr += combTampArrTotal[i][j].item_id + ",";
        itemidstr = itemidStr.substr(0, itemidStr.length - 1)
        // 选中的故障详情项拼接成字符串
        this.setData({
          itemids: itemidstr
        })
      }
    }
    // 未选择故障提示
    if (this.data.totalPrice == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请选择手机故障"
      })
    } else {
      var data = {
        mobile_id: this.data.mobileId,
        item_ids: this.data.itemids
      }
      wx.setStorageSync('order_data', data)
      wx.navigateTo({
        url: '../plan/plan',
      })
    }
  },
  // 获取手机品牌和型号
  getMobileList: function () {
    // 获取手机品牌 与 型号
    api.mobile_list().then(res => {
      var mobile = res.result[0].children[0];
      this.setData({
        mobileList: res.result,
        mobileId: mobile.mobile_id
      });
      wx.setStorageSync('mobile_data', res.result)
    })
  },
  // 获取首次进入默认手机故障
  getPhoneFault: function () {
    // 截取字符串 手机型号
    var model = this.data.phoneModel;
    // 判断是否含有<>
    if (model.indexOf("<") != -1) {
      var reg = /\<(.+?)\>/g;
      var str = model.match(reg);
      if (str) {
        var reg1 = new RegExp(str, "g");
        model = model.replace(reg1, "");
      }
    }
    if (model.indexOf("(") != -1) {
      // 判断是否含有()
      var regStr = new RegExp("\\((.| )+?\\)", "igm");
      var Str = model.match(regStr);
      if (Str) {
        model = model.replace(Str, "");
      }
    }
    if (model.indexOf(" ") != -1) {
      // 判断前后是否含有空格
      var trimReg = /(^\s*)|(\s*$)/g;
      model = model.replace(trimReg, "")
    }
    this.setData({
      phoneModel: model
    })

    // 设置默认手机问题显示
    var phoneModel = this.data.phoneModel;
    api.mobile_damage_modelCode({ modelCode: phoneModel }, { showLoading: false }).then(res => {
      if (res.errcode == "SUCCESS"){
        // 获取默认手机型号id
        this.setData({
          mobilepic: res.result.moblie_picture,
          mobileId: res.result.mobile_id,
          phoneModel: res.result.mobile_name
        }, () => {
          //获取故障列表
          this.getMobileDamage();
        });
      }else{
        console.log(res.errmsg);
      }     
    })
  },
  // 用户已授权的情况下 获取会员用户信息
  getMemberInfo: function () {
    api.getMemberInfo().then(res => {
      if (res.memberInfo.nickname) {
        this.setData({
          nickname: res.memberInfo.nickname,
          avatarUrl: res.memberInfo.avatarUrl
        }, () => {
          wx.setStorageSync('userInfo', res.memberInfo);
        })
      }
    })
  },
  // hasGetUserInfo(){
  //   //已获取用户信息
  //   this.getChangeMobile();// 缓存中获取选中手机型号、id手机对应图片（跳转页面更换手机型号）
  //   this.getMemberInfo();
  //   this.getUserInfoFromStorage();// 用户信息获取
  // },
  // 获取用户信息授权按钮事件
  bindgetuserinfo: function (e) {
    // 获取用户信息    
    const errMsg = e.detail.errMsg;
    if (errMsg === "getUserInfo:ok") {//用户点击允许
      this.applyUserInfo(e.detail);
    } else {//用户点击拒绝
      this.forceGetUserInfo()
    }
  },
  // 强制获取用户信息
  forceGetUserInfo: function () {
    wx.openSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              this.applyUserInfo(res)
            }
          })
        }
      }
    })
  },

  // 使用用户登录信息
  applyUserInfo: function (loginInfo) {
    const { encryptedData, iv, userInfo, errMsg } = loginInfo;
    wx.setStorageSync("userInfo", Object.assign(userInfo, { nickname: userInfo.nickName }))
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickname: userInfo.nickName,
      userinfobtn: false
    })
    api.getUserInfo({ encryptedData, iv }).then(res => {
      if (res.errcode == "SUCCESS") {
        this.getChangeMobile();// 缓存中获取选中手机型号、id手机对应图片（跳转页面更换手机型号）
        this.getMemberInfo();
        this.getUserInfoFromStorage();// 用户信息获取
      }
    })
  },
  // 从缓存中取出用户信息
  getUserInfoFromStorage: function () {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        if (res.data) {
          this.setData({
            nickname: res.data.nickname,
            avatarUrl: res.data.avatarUrl
          })
        }
      },
      fail: () => {
        this.getMemberInfo();
      }
    })
  },
  // 缓存中获取选中手机型号、id手机对应图片（跳转页面更换手机型号）
  getChangeMobile: function () {
    wx.getStorage({
      key: 'change_mobile',
      success: (res) => {
        this.setData({
          mobileId: res.data.mobileId,
          mobilepic: res.data.moblie_picture,
          phoneModel: res.data.mobileName,
          showChangeIphone: true
        }, () => {
          this.getMobileDamage();
        })
      },
      fail: () => {
        // 获取当前设备信息 （手机型号）
        wx.getSystemInfo({
          success: (res) => {
            this.setData({
              phoneModel: res.model,
              version: res.system
            }, () => {
              this.getPhoneFault();
            })
          },
        });
      }
    })
  },

  // 登录中获取获取信息
  getAuthorityLogin: function () {
    wx.getStorage({
      key: 'authorityLogin',
      success: res => {
        if (res.data) {
          this.setData({
            nickname: res.data.nickname,
            avatarUrl: res.data.avatarUrl,
            userinfobtn: false
          }, () => {
            this.getChangeMobile();// 缓存中获取选中手机型号、id手机对应图片（跳转页面更换手机型号）
            this.getMemberInfo();
            this.getUserInfoFromStorage();// 用户信息获取
          })
        }
      },
      fail: err => {
        this.setData({
          userinfobtn: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 故障列表背景图片
    var hostUrl = config.API_HOST;
    var imgUrl = "/appApi/images/icon.png";
    var demageUrl = hostUrl + imgUrl;
    this.setData({
      demageUrl: demageUrl
    })


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取banner图
    api.index_page({}, { showLoading: false }).then(res => {
      this.setData({
        banner: res.result.banner
      })
      this.getAuthorityLogin();
    });

  },
  // 获取选中手机故障列表 跳转页面更换手机
  getMobileDamage: function () {
    var mobile_id = this.data.mobileId;
    var mobileList = this.data.mobileList;
    wx.getStorage({
      key: 'mobileDamageList',
      success: res => {
        const result = res.data, combTampArrTotal = [];
        result.forEach((value, index) => {
          combTampArrTotal.push([])
          value.children.forEach(child => {
            if (child.pitch) {
              combTampArrTotal[index].push(child)
            }
          })
        })
        this.setData({
          mobileDamageList: result,
          combTampArrTotal
        })
      },
      fail: () => {
        api.mobile_damage({ mobile_id: mobile_id }).then(res => {
          // 初始化临时故障数组
          const combTampArrTotal = [];
          res.result.forEach(() => {
            combTampArrTotal.push([])
          })
          this.setData({
            mobileDamageList: res.result,
            combTampArrTotal
          })
          wx.setStorageSync("mobileDamageList", res.result)
        });
      }
    })
    // 展示更换的手机信息
    for (var i = 0; i < mobileList.length; i++) {
      var child = mobileList[i].children;
      for (var j = 0; j < child.length; j++)
        if (child[j].mobile_id == mobile_id) {
          this.setData({
            phoneModel: child[j].mobile_name,
            mobilepic: child[j].moblie_picture
          })
        }
    }
  },

  // 隐藏更换手机弹窗
  dialoghide: function () {
    this.setData({
      maskshow: false,
      dialogshow: false
    })
  },
  // 更换手机品牌和型号 弹窗显示
  changeiphone: function () {
    this.setData({
      maskshow: true,
      dialogshow: true
    })
    wx.getStorage({
      key: 'mobile_data',
      success: (res) => {
        var mobileData = res.data;
        this.setData({
          mobileData: mobileData
        }, () => {
          var mobileData = this.data.mobileData;
          var mobile = mobileData[0].children[0];
          this.setData({
            mobileList: mobileData,
            mobileId: mobile.mobile_id
          })
        })
      },
      fail: () => {
        this.getMobileList();
      }
    })
  },
  // 手机品牌和型号滑动事件
  bindChange: function (e) {
    const value = e.detail.value;
    const brandNum = value[0];
    const modelNum = value[1];
    var childLength = this.data.mobileList[brandNum].children.length;
    var mobile = this.data.mobileList[brandNum].children[modelNum > childLength - 1 ? childLength - 1 : modelNum];
    var mobileid = mobile.mobile_id;
    this.setData({
      curPhoneBrandIndex: brandNum,
      value: [brandNum, modelNum],
      mobileId: mobileid
    })
  },
  // 确定选中手机品牌和型号并获取故障列表
  changesure: function () {
    this.dialoghide();
    var combTampArrTotal = this.data.combTampArrTotal;
    var curPhoneFaultIndex = this.data.curPhoneFaultIndex;
    combTampArrTotal[curPhoneFaultIndex] = [];
    this.setData({
      combTampArrTotal: combTampArrTotal
    }, () => {
      this.price();
    })
    var mobile_id = this.data.mobileId;
    var mobileList = this.data.mobileList;
    api.mobile_damage({ mobile_id: mobile_id }).then(res => {
      // 初始化临时故障数组
      res.result.forEach(() => {
        this.data.combTampArrTotal.push([])
      })
      this.setData({
        mobileDamageList: res.result,
        combTampArrTotal: this.data.combTampArrTotal
      })
    });
    // 更换手机型号
    for (var i = 0; i < mobileList.length; i++) {
      var child = mobileList[i].children;
      for (var j = 0; j < child.length; j++)
        if (child[j].mobile_id == mobile_id) {
          this.setData({
            phoneModel: child[j].mobile_name,
            mobilepic: child[j].moblie_picture,
            showChangeIphone: true
          })
        }
    }
  },
  // 点击蒙层隐藏更换手机弹窗
  maskhide: function () {
    this.dialoghide();
  },
  // 取消更换手机型号
  cancelbtn: function () {
    this.dialoghide();
  }
})