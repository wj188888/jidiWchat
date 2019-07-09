/*  js中更改日期
 y年， m月， d日， h小时， n分钟，s秒
 let  start = new Date();
 start.change("d", -1); //昨天
 start.format('yyyy/MM/dd w'); //格式化
 start.change("m", -1); //上月*/

Date.prototype.change = function (part, value) {
  let newDate = new Date(this);
  value *= 1;
  if (isNaN(value)) {
    value = 0;
  }
  switch (part) {
    case "y":
      newDate.setFullYear(newDate.getFullYear() + value);
      break;
    case "m":
      newDate.setMonth(newDate.getMonth() + value);
      break;
    case "d":
      newDate.setDate(newDate.getDate() + value);
      break;
    case "h":
      newDate.setHours(newDate.getHours() + value);
      break;
    case "n":
      newDate.setMinutes(newDate.getMinutes() + value);
      break;
    case "s":
      newDate.setSeconds(newDate.getSeconds() + value);
      break;
    default:

  }
  return newDate;
};


//date类型转成string
/**
 * 对Date的扩展，将Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用1-2 个占位符
 * 年(y)可以用1-4 个占位符，毫秒(S)只能用1 个占位符(是1-3 位的数字)
 * eg:
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二20:09:04
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二08:09:04
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二08:09:04
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
//let  date = new Date();
//window.lnuim.showMsg(date.format("yyyy-MM-dd hh:mm:ss"));
Date.prototype.format = function (fmt) {
  if (!fmt) fmt = "yyyy-MM-dd";
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  let week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

//月末
Date.prototype.monthLastDay = function () {
  return this.change("m", 1).monthFirstDay().change("d", -1);
};

//月初
Date.prototype.monthFirstDay = function () {
  return this.change("d", 1 - this.getDate());
};


//时间差
/*输入：new Date().getTimeDif(null, "2017-7-12 20:00:00")
 返回:{ d: 62, h: 1, m: 57, s: 38 }*/
Date.prototype.getTimeDif = function (start, end) {
  if (!start) start = new Date().format("yyyy/MM/dd HH:mm:ss");
  let diff = new Date(end.replaceAll("-", "/")).getTime() - new Date(start.replaceAll("-", "/")).getTime();
  diff = diff > 0 ? diff : 0;

  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60)
  }
};
Date.prototype.isToday = function () {
  return this.format() === new Date().format();
}

//替换全部
String.prototype.replaceAll = function (reg, str) {
  return this.replace(new RegExp(reg, "gm"), str);
};

//删除数组中下标为index的元素
Array.prototype.removeIndex = function (index) {
  if (isNaN(index) || index > this.length) {
    return false;
  }
  else {
    this.splice(index, 1);
    return this
  }
};


//判断数组中是否含有某个对象
Array.prototype.hasEle = function (ele) {
  let result = false;
  for (let i = 0; i < this.length; i++) {
    if (typeof this[i] === "object") {
      if (JSON.stringify(this[i]) === JSON.stringify(ele)) {
        result = true;
      }
    } else {
      if (this[i] === ele) {
        result = true;
      }
    }
  }
  return result;
};

//获取元素在数组中的位置
Array.prototype.indexOf = function (val) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === val || JSON.stringify(this[i]) === JSON.stringify(val)) return i;
  }
  return -1;
};


//删除数组中指定元素
Array.prototype.remove = function (val) {
  let index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};


/**数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sortBy('number',false) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
Array.prototype.sortBy = function (attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev === undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }

  function sortBy(attr, rev) {
    return function (a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    }
  }

  return this.sort(sortBy(attr, rev))
};

const newDate = function (time) {
  if (!time) {
    time = new Date().getTime()
  } else if (typeof time === "string") {
    time = time.replaceAll("-", "/")
  }
  return new Date(time)
}

const randomString = function (len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


module.exports = {
   randomString, newDate,
 
}