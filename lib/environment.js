// Converts the input into the expected format.
module.exports = function(input) {
  let result = [];

  // Environment variables can come in both array and dictionary format.
  if (require('./isNumeric')(Object.keys(input)[0])) {
    // Already in array format!
    result = input;
  } else {
    // Convert { test: 1 } to 'test=1' format.
    Object.keys(input).forEach((key, index) => {
      result.push(`${key}=${input[key]}`);
    });
  }
  return result;
};
