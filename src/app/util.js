
module.exports = {
  toArray : function(args, begin) {
    begin = begin || 0;
    return Array.prototype.slice.call(args, begin);
  },
  pluck : function(ar, key) {
    if (ar == null) return [];
    return ar.map(function(v) { return v[key]; });
  },
  unique : function(ar) {
    var set = {}, res = [];
    if (ar == null) return res;
    ar.forEach(function(v) {
      if (set[v] !== void 0) { return; }
      res.push(v);
      set[v] = true;
    });
    return res;
  },
  toHash : function(ar, key) {
    var obj = {};
    ar.forEach(function(v) {
      obj[v[key]] = v;
    });
    return obj;
  }
};