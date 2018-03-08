// Converts the input into the expected format.
module.exports = function(input) {
  var result = "none";

  switch (input) {
    case 'on-failure':
      result = 'on-failure';
      break;
    case 'always':
      result = 'any';
      break;
    default:
      result = "none";
  }

  return result;
};
