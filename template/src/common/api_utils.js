export default {
  toQueryParams(params, page, limit) {
    let equalParams = {}
    let notEqualParams = {}
    let likeParams = {}
    for (let k in params) {
      let ks = k.split(".")
      if (ks.length == 1) {
        equalParams[k] = params[k]
      } else if (ks.length == 2) {
        switch (ks[0]) {
          case "equal":
            equalParams[ks[1]] = params[k];
            break;
          case "like":
            likeParams[ks[1]] = params[k];
            break;
          case "notEqual":
            notEqualParams[ks[1]] = params[k];
            break;
        }
      }
    }
    return {
      page, limit, equalParams, notEqualParams, likeParams
    }
  }
}