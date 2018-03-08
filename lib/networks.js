// Converts the input into the expected format.
module.exports = function(input) {
  var result = [];

  // Networks can come in both array and dictionary format.
  if (require('./isNumeric')(Object.keys(input)[0])) {
    for (var key in input) {
      result.push({
        Target: input[key],
        Aliases: []
      });
    }
  } else {
    for (var key in input) {
      result.push({
        Target: key,
        Aliases: input[key]['aliases']
      });
    }
  }

  return result;
};
