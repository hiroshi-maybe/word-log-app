
module.exports = {
  toArray : function(args) {
    return Array.prototype.slice.call(args, 0);
  }
};