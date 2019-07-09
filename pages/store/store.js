// pages/store/store.js
const api = require('../../utils/API.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeName: '',//输入搜索值
    storeLists: [],//门店列表
    storename: '',//门店名称
    storeaddre: '',//门店地址
    storeid: '',//门店id
    storetime:'',//门店服务时间
    serviceTel:''//门店服务电话
  },
  // 搜索
  searchStore: function () {
    var item_ids = this.data.item_ids;
    var storeName = this.data.storeName;
    api.parts_list({ item_ids: item_ids, storeName: storeName }).then(res => {
      this.setData({
        storeLists: res.result
      })
    })
  },
  // 获取输入搜索信息
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      storeName: value,
    });

  },
  // 选中门店
  storechoose: function (e) {
    this.setData({
      storename: e.currentTarget.dataset.storename,
      storeaddre: e.currentTarget.dataset.storeaddress,
      storeid: e.currentTarget.dataset.id,
      storetime: e.currentTarget.dataset.servicetime,
      serviceTel: e.currentTarget.dataset.servicetel,
    })
    var data = {
      storename: this.data.storename,
      storeaddre: this.data.storeaddre,
      storeid: this.data.storeid,
      storetime: this.data.storetime,
      serviceTel: this.data.serviceTel
    }
    wx.setStorageSync('store_data', data)
    // 选中返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  // 电话联系
  callbtn: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  //查看地图
  mapbtn: function (e) {
    var lat = parseFloat(e.currentTarget.dataset.lat);
    var lng = parseFloat(e.currentTarget.dataset.lng);
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 28
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'fault_ids',
      success: function (res) {
        that.setData({
          item_ids: res.data.item_ids
        })
        // 通过故障id查询可维修的门店
        var item_ids = that.data.item_ids;
        api.parts_list({ item_ids: item_ids }).then(res => {
          that.setData({
            storeLists: res.result
          })
        })
      },
    })
  }
})