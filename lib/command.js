// Converts the input into the expected format.
module.exports = function(input) {
  var result = [ input ];
  if (Array.isArray(input)) {
    result = input;
  }

  return result;
};
