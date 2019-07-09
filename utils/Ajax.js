import serialize from "./serialize"

/*
new Promise((resolve, reject) => {
    Ajax({
        url: "/api",
        success: resolve,
        error: reject,
        beforeSend: xhr => {
            xhr.setRequestHeader("token", "123456789");
        }
    })
}).then(function (ResultJson) {
    window.console.log(ResultJson)
}).catch(function (ErrMsg) {
    window.console.log(ErrMsg)
    //获取数据失败时的处理逻辑
})

const codeDict = {
    0: "连接超时",
    404: "地址不存在",
    413: "请求实体太大",
    500: "服务器内部错误"
};*/

function Ajax() {
  const noop = function () { };
  const option = arguments[arguments.length - 1]
  let defaults = Object.assign({
    type: "get",
    timeout: 5000,
    beforeSend: noop,
    complete: noop,
    success: noop,
    error: noop,
    data: {},
    showLoading:true,
    header: { 'content-type': 'application/json'}
  }, option);
  if (!defaults.url) return;
  defaults.beforeSend();
  defaults.showLoading?wx.showLoading({mask:true}):null
  wx.request({
    url: defaults.url,
    data: defaults.data,
    header: defaults.header,
    method: defaults.type,
    dataType: "json",
    responseType: "text",
    success: ({ data }) => {
      if (typeof data === "object") {
        defaults.success(data)
      } else {
        wx.showModal({
          title: '错误',
          content: "服务器返回数据格式异常",
          confirmText: "重试",
          success: ({ confirm }) => {
            if (confirm) {
              Ajax(option)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    fail: err => {
      if (err.errMsg.split(":")[1] === "fail timeout") {
        wx.showModal({
          title: '错误',
          content: '网络超时请重试',
          confirmText: "重试",
          success: ({ confirm})=> {
            if (confirm) {
              ajax(option)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    complete:e=>{
      wx.hideLoading()
      defaults.complete()
    }
  })
}

module.exports = Ajax;