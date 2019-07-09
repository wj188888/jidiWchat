// pages/getmodel/getmodel.js
const api = require('../../utils/API.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobileName: '',//搜索设备型号关键字
    curIndex: 0,//tab切换显示第几个

    mobileList: [],//手机品牌和型号
    curPhoneBrandIndex: 0,//当前选中手机品牌
    mobileDamageList: [],//故障列表
  },
  // 获取输入搜索信息
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      mobileName: value,
    });
  },
  // 搜索设备
  searchMobile: function () {
    var mobile_name = this.data.mobileName;
    api.mobile_list({ mobile_name: mobile_name }).then(res => {
      this.setData({
        mobileList: res.result
      });
    })
  },
  //tab切换事件 选择维修方式
  bindTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index,
      curPhoneBrandIndex: index
    })
  },
  // 获取当前选中手机型号
  getcurModel: function (e) {
    var mobileId = e.currentTarget.dataset.id;
    var mobileName = e.currentTarget.dataset.text;
    var moblie_picture = e.currentTarget.dataset.moblie_picture;
    var data = {
      mobileId: mobileId,
      mobileName: mobileName,
      moblie_picture: moblie_picture
    }
    wx.setStorageSync("change_mobile", data);
    // 手机对应的故障列表查询
    api.mobile_damage({ mobile_id: mobileId }, { showLoading: false }).then(res => {
      this.setData({
        mobileDamageList: res.result
      })
      wx.setStorageSync("mobileDamageList", res.result)
      wx.navigateTo({
        url: '../pageIndex/pageIndex',
      })
    });
  },
  // 获取手机品牌和型号
  getMobileList: function () {
    // 获取手机品牌 与 型号
    api.mobile_list().then(res => {
      this.setData({
        mobileList: res.result
      });
      wx.setStorageSync('mobile_data', res.result)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取缓存中的手机品牌和型号
    wx.getStorage({
      key: 'mobile_data',
      success: (res) => {
        this.setData({
          mobileList: res.data
        })
      },
      fail: () => {
        this.getMobileList();
      }
    })
  }
})