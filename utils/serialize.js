function serialize(obj, key) {
  let paramStr = "";
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    paramStr += "&" + key + "=" + encodeURIComponent(obj);
  } else {
    let i;
    for (i in obj) {
      let k = !key ? i : key + (obj instanceof Array ? "[" + i + "]" : "." + i);
      paramStr += '&' + serialize(obj[i], k);
    }
  }
  return paramStr.substr(1);
}
module.exports = serialize;