var createBaseObj = function() {
  return Object.create({
    setResult: function(result) {
      this.result = result;
    },
    setData: function(data) {
      this.data = data;
    }
  });
};

var responseFactory = {
  success: function (data) {
    var res = createBaseObj();
    res.setResult("success");
    res.setData(data);
    return res;
  },
  error: function(description) {
    var res = createBaseObj();
    res.setResult("error");
    res.setData({"message" : description});
    return res;
  }
};

module.exports = responseFactory;