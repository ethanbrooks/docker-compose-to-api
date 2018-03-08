// Converts the input into the expected format.
module.exports = function(input) {
  var result = [];

  input.map((val) => {
    if ('spread' in val) {
      result.push({ Spread: { SpreadDescriptor: val['spread'] } });
    }
  });

  return result;
};
