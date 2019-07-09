// pages/goevaluate/goevaluate.js
const api = require('../../utils/API.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',

    starLists: [
      '../../image/changeStar.png',
      '../../image/changeStar.png',
      '../../image/changeStar.png',
      '../../image/changeStar.png',
      '../../image/changeStar.png',
    ],
    comment_point_tips: '',
    comment_point: '',//星级评价提示语
    curStarIndex: 4,
    starTxtList: '',//星级评价提示语
    comment_tags: '',//评价标签
    tagsLists: [],//添加选中标签样式数组
    tagsArr: [],//选中标签

    content: '',//留言

    isChecked: false,//是否匿名提交
    isAnonymous: '',

    showSuccessDialog: false,
  },

  // 几星评价
  starTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var starLists = this.data.starLists;
    for (var i = 0; i < starLists.length; i++) {
      if (i <= index) {
        starLists[i] = '../../image/changeStar.png';
      } else {
        starLists[i] = '../../image/star.png';
      }
    }
    this.setData({
      starLists: starLists,
      curStarIndex: index,
    }, () => {
      this.getStarTxt();
    });
  },

  // 获取星级等级提示语
  getStarTxt: function () {
    var curStarIndex = this.data.curStarIndex;
    var comment_point = this.data.comment_point;
    var starTxtList = this.data.starTxtList;
    for (var j = 0; j < comment_point.length; j++) {
      if (j == curStarIndex) {
        starTxtList = comment_point[j];
      }
    }
    this.setData({
      starTxtList: starTxtList
    });
  },

  // 选择评价标签
  changeTag: function (e) {
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.value;
    var tagsLists = this.data.tagsLists;
    var tagsArr = this.data.tagsArr;
    if (tagsArr.length < 3) {
      if (tagsLists[index].checkedTag) {
        tagsLists[index].checkedTag = !tagsLists[index].checkedTag;
      } else {
        tagsLists[index].checkedTag = true;
      }
    } else {
      if (tagsLists[index].checkedTag == true) {
        tagsLists[index].checkedTag = !tagsLists[index].checkedTag;
      } else {
        wx.showModal({
          title: '提示',
          content: "最多选择3个标签"
        })
      }
    }
    tagsArr = [];
    for (var i = 0; i < tagsLists.length; i++) {
      if (tagsLists[i].checkedTag == true) {
        tagsArr.push(tagsLists[i])
      }
    }
    this.setData({
      tagsLists: tagsLists,
      tagsArr: tagsArr
    });
  },

  //获取留言
  getMessage: function (e) {
    var value = e.detail.value;
    this.setData({
      content: value
    });
  },

  // 是否匿名提交
  changeSwitch: function () {
    var isChecked = this.data.isChecked;
    var isAnonymous = this.data.isAnonymous;
    isChecked = !isChecked;
    if (isChecked == true) {
      isAnonymous = 1
    }
    this.setData({
      isChecked: isChecked,
      isAnonymous: isAnonymous
    });

  },

  // 提交评论
  submitEvaluate: function () {
    var tagsArr = this.data.tagsArr;
    var tags = '';
    for (var i = 0; i < tagsArr.length; i++) {
      tags += tagsArr[i].name + ",";
    }
    if (tags.length > 0) {
      tags = tags.substr(0, tags.length - 1);
    }
    var params = {
      orderid: this.data.orderid,
      point: this.data.curStarIndex + 1,
      tags: tags,
      content: this.data.content,
      isAnonymous: this.data.isAnonymous,
    }
    if (tags.length == 0) {
      wx.showModal({
        title: '提示',
        content: "至少选择1个标签"
      })
    }
    api.evaluate_insert(params).then(res => {
      this.setData({
        showSuccessDialog: true
      });
    });
  },

  // 关闭评价成功弹窗
  closeDialog: function () {
    this.setData({
      showSuccessDialog: false
    });
    wx.navigateBack({
      url: '../person/pageIndex',
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
    api.evaluate_getConfig().then(res => {
      this.setData({
        comment_point: res.result.comment_point,
        comment_point_tips: res.result.comment_point_tips,
        comment_tags: res.result.comment_tags,
        starTxtList: res.result.comment_point[res.result.comment_point.length - 1]
      })
      var comment_tags = this.data.comment_tags;
      var tagsLists = this.data.tagsLists;
      for (var i = 0; i < comment_tags.length; i++) {
        tagsLists.push({ name: comment_tags[i] });
      }
      this.setData({
        tagsLists: tagsLists
      })
    });
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