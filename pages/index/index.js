var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    imgUrls: [
      '/image/banner.jpg',
      '/image/banner.jpg',
      '/image/banner.jpg',
    ],

    userid: "",
    userInfo: "",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    mobilepic: '/image/mobilepic.jpg',
    version: '', //自动获取手机型号
    system: '', //系统版本号
    brandArr: "",//品牌列表
    modelArr: "",//品牌列表
    value: [0, 0],
    maskshow: false, //遮罩层
    changeshow: false, //更换手机型号弹窗
    avatarUr: '',
    chooseFailureList: [], //每种故障详情列表 
    detailFailureArr: "", // //每种故障详情列表弹框展示
    chooseFailureindex: -1, //选中哪个故障类型
    combList: '', //组合列表
    chooseFailureArr: '', //故障类型列表
    combArr: '', //组合列表
    detailFailureFlag: true, //是否显示故障详情列表
    detailFailureOrtherFlag: true, //是否显示其他故障弹窗
    price: 0, //总维修价格
    combTampArr: [], //选中故障详情组合
    combTampNum: 0, //选中故障详情组合的长度
    modelid: "",//品牌id
    model: "",//品牌
    version: ""//机型
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {

    var that = this

    that.setData({
      version: app.globalData.version,

    })

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
      })

    })

    var that = this
    //手机品牌 与 型号
    var version = app.globalData.version;
    //请求服务器根据根据手机机型找到对应的品牌并在型号展示前添加该品牌名
    wx.request({
      url: app.globalData.serverUrl + 'Home/replaceModel',
      data: {
        model: version,//传递机型
        type: 1
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        that.setData({
          model: res.data.data[0].title,
          
        })

        // wx.request({
        //   url: app.globalData.serverUrl + 'Home/replaceModel',
        //   data: {
        //     id: res.data.data[0].id
        //   },
        //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //   // header: {}, // 设置请求的 header
        //   success: function (res) {
        //     console.log(res)
        //     that.setData({
        //       version: res.data.data[0].title,

        //     })

        //   },

        // })

      },

    })
    //请求服务器获取故障列表（请选择手机问题）
    wx.request({
      url: app.globalData.serverUrl + 'Home/replaceModel',
      data: {
        model: version,//传递机型获取各机型故障大类
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        //如果数据中没有该手机型号提醒更换手机型号
 
          wx.request({
            url: app.globalData.serverUrl + 'Home/replaceModel',
            data: {
              id: res.data.data[0].id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log(res)
              that.setData({
                chooseFailureList: res.data.data,

              })

            },

          })

      

      },

    })
    //获取所有故障大类中的小类
    wx.request({
      url: app.globalData.serverUrl + 'Home/replaceModel',
      data: {
        type: 2
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        that.setData({
          detailFailureList: res.data.data

        })

      },

    })


  },
  // 更换手机型号点击事件
  changebtn: function () {
    this.setData({
      maskshow: true,
      changeshow: true
    })
    var that = this;
    //请求服务获取品牌列表
    wx.request({
      url: app.globalData.serverUrl + 'Home/replaceModel',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          brandArr: res.data.data,

        })

        //根据品牌获取型号列表
        wx.request({
          url: app.globalData.serverUrl + 'Home/replaceModel',
          data: {
            id: res.data.data[0].id

          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            that.setData({
              modelArr: res.data.data
            })

          },

        })

      },

    })

  },

  // 更换手机机型确定事件
  changesure: function () {

    var that = this
    this.popclose()
    var brandArr = that.data.brandArr
    var modelArr = that.data.modelArr
    var value = that.data.value
    var model = that.data.brandArr[value[0]].title//picker-view选中的值
    var version = that.data.modelArr[value[1]].title//picker-view选中的值
    that.setData({
      version: version,
      model: model
    })

    var that = this
    //根据所选的品牌型号来刷新显示故障列表（机型不同故障不同）
    var version = that.data.version;
    wx.request({
      url: app.globalData.serverUrl + 'Home/replaceModel',
      data: {
        model: version
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        wx.request({
          url: app.globalData.serverUrl + 'Home/replaceModel',
          data: {
            id: res.data.data[0].id
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {

            that.setData({
              chooseFailureList: res.data.data

            })

          },

        })

      },

    })

  },
  //滑动选择
  bindChange: function (e) {
    const value = e.detail.value
    console.log(e)
    const brandNum = value[0]
    const modelNum = value[1]
    console.log(brandNum)
    console.log(modelNum)

    this.setData({
      value: [brandNum, modelNum],

    })

    var id = this.data.brandArr[brandNum].id
    var that = this
    wx.request({
      url: app.globalData.serverUrl + 'Home/replaceModel',
      data: {
        id: id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.setData({
          modelArr: res.data.data
        })

      },

    })

  },

  //选择故障类型
  select_chooseFailureList: function (event) {
    var that = this
    that.setData({
      detailFailureFlag: false,
    })

    var ChooseFailureid = event.target.dataset.id; //故障类型id
    var sub_index = event.target.dataset.pid;
    var num = event.target.dataset.num;
    var text = event.target.dataset.text;

    //查找符合条件的故障详情放到临时数组里面
    var ArrTemp = [];
    var detailFailureList = this.data.detailFailureList;
    for (var i = 0, len = detailFailureList.length; i < len; i++) {
      if (ChooseFailureid == detailFailureList[i].pid) {
        ArrTemp.push(detailFailureList[i]);
      }
    }

    //查询选择的故障类型对应有没有选中过故障详情
    var chooseFailureList = this.data.chooseFailureList;
    var select_index = chooseFailureList[num].select_index;

    if (select_index > -1) {
      for (var j = 0; j < ArrTemp.length; j++) {
        if (j == select_index) {
          ArrTemp[j].class = true;
          ArrTemp[j].ChooseFailureid = ChooseFailureid;
        } else {
          ArrTemp[j].class = false;
          ArrTemp[j].ChooseFailureid = ChooseFailureid;
        }
      }
    } else {
      for (var j = 0; j < ArrTemp.length; j++) {
        ArrTemp[j].class = false;
        ArrTemp[j].ChooseFailureid = ChooseFailureid;
      }
    }

    this.setData({
      chooseFailureTitle: text, //选中的故障类型
      detailFailureArr: ArrTemp, //故障详情列表
      chooseFailureindex: num, //当前选中的故障索引
      detailFailureFlag: false, //是否显示故障详情列表
    });

  },
  //选择故障详情
  select_detailFailur: function (event) {
    var sub_index = event.target.dataset.pid;
    var num = event.target.dataset.num;
    var text = event.target.dataset.text;
    var grade = event.target.dataset.grade;
    var ChooseFailureid = event.target.dataset.choosefailureid;

    //样式切换
    var detailFailureArr = this.data.detailFailureArr;
    for (var i = 0; i < detailFailureArr.length; i++) {
      if (i == num) {
        if (detailFailureArr[num].class) { //已选中
          var combTampArr = this.data.combTampArr;
          for (var j = 0; j < combTampArr.length; j++) {
            if (combTampArr[j].sub_index == sub_index) { //找到所属的类别删除
              combTampArr.splice(j, 1);
            }
          }
        } else { //未选中
          //选择故障详情添加到选中故障详情组合数组
          var combTampArr = this.data.combTampArr;
          if (combTampArr.length) { //是否有数据
            var flag = true;
            for (var k = 0; k < combTampArr.length; k++) {
              if (combTampArr[k].sub_index == sub_index) { //找到所属的类别更换
                combTampArr[k] = {
                  sub_index: sub_index,
                  num: num,
                  text: text,
                  grade: grade,
                  ChooseFailureid: ChooseFailureid
                }
                flag = false;
              }
            }
            if (flag) { //没找到所属类别直接添加
              combTampArr.push({
                sub_index: sub_index,
                num: num,
                text: text,
                grade: grade,
                ChooseFailureid: ChooseFailureid
              })
            }
          } else { //没有数据直接添加
            combTampArr.push({
              sub_index: sub_index,
              num: num,
              text: text,
              grade: grade,
              ChooseFailureid: ChooseFailureid
            })
          }
        }
        detailFailureArr[num].class = !detailFailureArr[num].class;

      } else {
        detailFailureArr[i].class = false;
      }
    }

    //修改已选中故障详情的索引
    var chooseFailureList = this.data.chooseFailureList;
    var chooseFailureindex = this.data.chooseFailureindex;
    var flag_1 = true;
    for (var j = 0; j < detailFailureArr.length; j++) {
      if (detailFailureArr[j].class) {
        chooseFailureList[chooseFailureindex].select_index = j;
        flag_1 = false;
      }
    }
    if (flag_1) {
      chooseFailureList[chooseFailureindex].select_index = -1;
    }

    this.setData({
      combTampArr: combTampArr,
      detailFailureArr: detailFailureArr,
      chooseFailureList: chooseFailureList
    })
  },
  // 取消
  cancel: function () {
    var combTampArr = this.data.combTampArr;
    var combTampNum = this.data.combTampNum;
    if (combTampArr.length == combTampNum) { //相等，则没有选中故障详情

    } else {
      combTampArr.pop(); //删除并返回数组的最后一个元素
    }

    this.setData({
      detailFailureFlag: true,
      combTampNum: combTampArr.length,
      combTampArr: combTampArr
    })
  },
  //确定
  confirm: function () {
    var combTampArr = this.data.combTampArr;
    var chooseFailureList = this.data.chooseFailureList;
    var chooseFailureindex = this.data.chooseFailureindex;

    //查找符合条件的故障详情放到临时数组里面
    var ArrTemp = [];
    var detailFailureArr = this.data.detailFailureArr;
    for (var i = 0, len = detailFailureArr.length; i < len; i++) {
      if (chooseFailureList[chooseFailureindex].sub_index == detailFailureArr[i].sub_index) {
        ArrTemp.push(detailFailureArr[i]);
      }
    }

    var classFlag = true;
    for (var k = 0; k < ArrTemp.length; k++) {
      if (ArrTemp[k].class) {
        chooseFailureList[chooseFailureindex].class = true;
        classFlag = false;
      }
    }
    if (classFlag) {
      chooseFailureList[chooseFailureindex].class = false;
    }

    this.setData({
      chooseFailureList: chooseFailureList,
      detailFailureFlag: true,
      combTampNum: combTampArr.length
    })

    this.price();

  },

  //统计维修价格
  price: function () {
    var combTampArr = this.data.combTampArr;
    var price = 0;
    for (var l = 0; l < combTampArr.length; l++) {
      price = price + parseFloat(combTampArr[l].grade);
    }
    this.setData({
      price: price
    })
  },

  //立即预约
  goplan: function () {
    if (this.data.price == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请选择手机故障"
      })
    } else {

      var data = {

        combTampArr: this.data.combTampArr,
        price: this.data.price,
        version: this.data.version,
        model: this.data.model,

      }

      //保存下单对象信息到本地 
      try {
        wx.setStorageSync('order_data', data)
      } catch (e) {
        console.log("select_fault页面的存储本地数据catch")
        console.log(e)
      }
      wx.navigateTo({
        url: '../plan/plan'
      })


    }

  },



  //弹窗取消按钮点击事件
  cancelbtn: function () {
    this.popclose()
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
      changeshow: false,
      quespop: false
    })
  },

  //  个人中心
  toperson: function () {
    wx.navigateTo({
      url: '../person/person',
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