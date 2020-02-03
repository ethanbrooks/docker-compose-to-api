// Converts the input into the expected format.
module.exports = function(input) {
  const result = [];

  // Networks can come in both array and dictionary format.
  if (require('./isNumeric')(Object.keys(input)[0])) {
    Object.keys(input).forEach((key, index) => {
      result.push({
        Target: input[key],
        Aliases: []
      });
    });
  } else {
    Object.keys(input).forEach((key, index) => {
      result.push({
        Target: key,
        Aliases: input[key].aliases
      });
    });
  }
  return result;
};
