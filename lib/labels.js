// Converts the input into the expected format.
module.exports = function(input) {
  var result = {};

  // Labels can come in both array and dictionary format.
  if (require('./isNumeric')(Object.keys(input)[0])) {
    // Array format
    for (var i = 0; i < input.length; i++) {
      const parts = input[i].split("=");
      if (parts.length == 2) {
        result[parts[0]] = parts[1];
      }
    }
  } else {
    // Dictionary format
    result = input;
  }

  return result;
};
