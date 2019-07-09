import config from "../config.js"
import Ajax from "./Ajax"
import queueAjax from "./queueAjax"
import checkSession from "./checkSession"

function promiseFactory(url, useToken, isGet, multipartFormData) {
  return function (data, params = { showLoading: true }) {
    return new Promise((resolve, reject) => {
      if (useToken) {
        queueAjax.request({
          url: `${config.API_HOST + url}`,
          data: data || {},
          type: isGet ? "get" : "post",
          callback: resolve,
          fail: reject,
          showLoading: params.showLoading
        })
      } else if (multipartFormData) {
        checkSession(token => {
          const uploadTask = wx.uploadFile({
            url: `${config.API_HOST + url}`,
            filePath: params.file || null,
            name: 'file',
            formData: { token },
            success: resolve,
            fail: reject,
            showLoading: params.showLoading || true
          })
          uploadTask.onProgressUpdate(params.onProgressUpdate || new Function())
        })
      } else {
        Ajax({
          url: `${config.API_HOST + url}`,
          data: data || {},
          type: isGet ? "get" : "post",
          success: resolve,
          error: reject,
          showLoading: params.showLoading || true
        })
      }
    }).catch(e => {
      console.log(e)
    });
  }
}

let APISource = [
  { name: "getUserInfo", url: "/appApi/?p=wx&m=getUserInfo", isGet: false, useToken: true },
  { name: "updateLocation", url: "/appApi/?p=wx&m=updateLocation", isGet: false, useToken: true },
  { name: "mobile_list", url: "/appApi/?p=mobile_library&m=mobile_list", isGet: true, useToken: true },
  { name: "mobile_damage", url: "/appApi/?p=mobile_library&m=mobile_damage", isGet: true, useToken: true },
  { name: "orderList", url: "/appApi/?p=order&m=list", isGet: true, useToken: true },
  { name: "confirm_order", url: "/appApi/?p=order&m=confirm_order", isGet: false, useToken: true },
  { name: "storeList", url: "/appApi/?p=store&m=list", isGet: true, useToken: true },
  { name: "parts_list", url: "/appApi/?p=store&m=parts_list", isGet: false, useToken: true },
  { name: "engineer", url: "/appApi/?p=store&m=engineer", isGet: true, useToken: true },
  { name: "create_order", url: "/appApi/?p=order&m=create_order", isGet: false, useToken: true },
  { name: "order_details", url: "/appApi/?p=order&m=details", isGet: true, useToken: true },
  { name: "order_cause", url: "/appApi/?p=order&m=cause", isGet: false, useToken: true },
  { name: "mobile_damage_modelCode", url: "/appApi/?p=mobile_library&m=mobile_damage_modelCode", isGet: false, useToken: true },
  { name: "index_page", url: "/appApi/?m=index", isGet: true, useToken: true },
  { name: "member_index", url: "/appApi/?m=member_index", isGet: false, useToken: true },
  { name: "getMemberInfo", url: "/appApi/?p=wx&m=getMemberInfo", isGet: true, useToken: true },
  { name: "engineerIndex", url: "/appApi/?p=engineer&m=index", isGet: true, useToken: true },
  { name: "engineerorderList", url: "/appApi/?p=engineer&m=orderList", isGet: true, useToken: true },
  { name: "orderDetails", url: "/appApi/?p=engineer&m=orderDetails", isGet: true, useToken: true },
  { name: "get_itemList", url: "/appApi/?p=engineer&m=get_itemList", isGet: true, useToken: true },
  { name: "get_storeStockPartsType", url: "/appApi/?p=engineer&m=get_storeStockPartsType", isGet: true, useToken: true },
  { name: "get_storeStockPartsList", url: "/appApi/?p=engineer&m=get_storeStockPartsList", isGet: true, useToken: true },
  { name: "orderCause", url: "/appApi/?p=engineer&m=orderCause", isGet: false, useToken: true },
  { name: "editBusinessTel", url: "/appApi/?p=engineer&m=editBusinessTel", isGet: false, useToken: true },
  { name: "update_serviceState", url: "/appApi/?p=engineer&m=update_serviceState", isGet: false, useToken: true },
  { name: "update_orderPayState", url: "/appApi/?p=engineer&m=update_orderPayState", isGet: false, useToken: true },
  { name: "updateItems", url: "/appApi/?p=engineer&m=updateItems", isGet: false, useToken: true },
  { name: "orderConfirm", url: "/appApi/?p=engineer&m=orderConfirm", isGet: false, useToken: true },
  { name: "userorderList", url: "/appApi/?p=order&m=list_v2", isGet: true, useToken: true },
  { name: "userorderDetails", url: "/appApi/?p=order&m=details_v2", isGet: true, useToken: true },
  { name: "evaluate_getConfig", url: "/appApi/?p=order&m=comment&action=getConfig", isGet: true, useToken: true },
  { name: "evaluate_insert", url: "/appApi/?p=order&m=comment&action=insert", isGet: false, useToken: true },
  { name: "evaluate_view", url: "/appApi/?p=order&m=comment&action=view", isGet: false, useToken: true },
];

let API = {};
APISource.forEach(value => {
  API[value.name] = promiseFactory(value.url, value.useToken, value.isGet, value.multipartFormData)
});


module.exports = API;