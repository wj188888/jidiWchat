// pages/myorder/myorder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   myorderlist:[],//订单列表
   status:"",//状态
   page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = app.globalData.userid
    var that=this
    //请求服务器获取数据
    wx.request({
      url: app.globalData.serverUrl + 'User/order',
      data: {
        token: token,
     
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       console.log(res)

      
       let orderlist = res.data.data.info
       for (let i = 0; i < orderlist.length; i++) {
         orderlist[i].status = ["下单未支付", "维修中","已完成","已取消"][Number(orderlist[i].status)-1]
        //  if (orderlist[i].status == 1) {
        //    orderlist[i].status="下单未支付"
        //      }else
      
        //    if(orderlist[i].status == 2) {
        //      orderlist[i].status = "维修中"
        //    }
        //    else

        //      if (orderlist[i].status == 3) {
        //        orderlist[i].status = "已完成"
        //      }
        //      else

        //        if (orderlist[i].status == 4) {
        //          orderlist[i].status = "已取消"
        //        }
       }
       that.setData({
         myorderlist: orderlist 

       })

      
      },

    })


    
  },
order_view:function(e){


  wx.redirectTo({
    url: '../orderinfo/orderinfo?order_id=' + e.currentTarget.dataset.order_id + '&status=' + e.currentTarget.dataset.status,

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