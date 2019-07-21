import moment from 'moment'
export default {
  datetime(value, format) {
    format = format || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(format);
  },
  number(value, decimalAccuracy) {
    value = value + "";
    if (!/-?\d+(\.\d+)?/.test(value) || typeof decimalAccuracy !== 'number' || decimalAccuracy < 0) {
      return null;
    }
    let index = value.indexOf(".");
    if (decimalAccuracy == 0) {
      return index == -1 ? value : value.substring(0, index);
    }
    if (index == -1) {
      index = value.length
      value += ".";
    }

    for (let i = 0; i < decimalAccuracy; i++) {
      value += "0";
    }
    return value.substring(0, index + decimalAccuracy + 1);
  },
  numberToMoney(value) {
    value = value + "";
    if (!/-?\d+(\.\d+)?/.test(value)) {
      return null;
    }
    let index = value.indexOf(".");
    if (index != -1) {
      value = value.substring(0, index);
    }
    let flag = value.indexOf("-") != -1 ? "-" : "";
    if (flag) {
      value = value.substring(1);
    }
    let chs = value.split("");
    let result = "";
    for (let i in chs) {
      if (i != 0 && i % 3 == 0) {
        result = "," + result
      }
      result = chs[chs.length - 1 - i] + result;
    }
    return flag + result;
  }
}