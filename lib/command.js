// Converts the input into the expected format.
module.exports = function(input) {
  let result = [input];
  if (Array.isArray(input)) {
    result = input;
  }

  return result;
};
