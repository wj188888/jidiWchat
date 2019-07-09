/*  ajax队列请求
 @params 请求参数
 @retry 重试标识
 queueAjax.request(params,retry);
 queueAjax.retry()
 */
import Ajax from "./Ajax"
import checkSession from "./checkSession"

let queueAjax = {
  queue: [],
  allowFlag: true,
  request: function (params, retry) {
    !retry ? this.queue.push(params) : null;
    if (this.allowFlag === true) {
      this.allowFlag = false;
      let _this = this;
      // let loadIndex;
      let ajaxParams = Object.assign({
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (data) {
          if (data.errcode === "SIGNFAIL" || (data.errcode === "FAIL" && data.errmsg === "Token解密失败")) {
            wx.removeStorage({
              key: 'token',
              success: function (res) {                
                wx.showModal({
                  title: "温馨提示",
                  content: "登录失效，请重新登录",
                  showCancel: false,
                  success: (confirm) => {
                    if (confirm) {
                      _this.retry()
                    } else if (res.cancel) {
                      queueAjax.allowFlag = true;
                      queueAjax.queue = [];
                      console.log('用户点击取消')
                    }
                  }
                })
              } 
            })            
          } else {
            wx.setStorage({
              key: "token",
              data: data.token,
              success: function () {
                _this.queue[0].callback(data);
                _this.queue.shift();
                _this.retry()
              }
            })            
          }
        },
        error: function (err) {
          _this.queue[0].fail(err)
          let errmsg;
          if (err.timeout) {
            errmsg = `连接超时`
          } else {
            errmsg = err.responseText || err.statusText
          }
          window.showModal({
            title: "网络错误",
            errmsg: errmsg,
            btns: ["重试"],
            hideCancel: false,
            confirmFun: () => {
              window.hideModal()
              setTimeout(() => {
                _this.retry()
              }, 490)
            }
          });
        }
      }, _this.queue[0])
      checkSession((token)=>{
        ajaxParams.data = Object.assign(ajaxParams.data, {
          "token": token
        });
        Ajax(ajaxParams)
      })      
    }
  },
  retry: function () {
    this.allowFlag = true;
    if (this.queue.length) {
      this.request(this.queue[0], true)
    }
  }
};

module.exports = queueAjax;