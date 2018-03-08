// Converts the input into the expected format.
module.exports = function(input) {
  var result = [];

  for (var key in input) {
    if ('file' in input[key]) {
      result.push({
        ConfigID: key,
        ConfigName: key,
        File: input[key].file
      });
    }
  }

  return result;
};
