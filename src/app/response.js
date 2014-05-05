var createBaseObj = function() {
  return Object.create({
    setResultCode: function(code) {
      this.resultCode = code;
    },
    setData: function(data) {
      this.data = data;
    }
  });
};

var responseFactory = {
  success: function (data) {
    var res = createBaseObj();
    res.setResultCode("0");
    res.setData(data);
    return res;
  },
  error: function(description) {
    var res = createBaseObj();
    res.setResultCode("1");
    res.setData({"error_description" : description});
    return res;
  }
};

module.exports = responseFactory;