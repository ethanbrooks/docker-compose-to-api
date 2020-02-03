// Converts the input into the expected format.
module.exports = function(input) {
  const result = [];

  input.map((val) => {
    if ('spread' in val) {
      result.push({ Spread: { SpreadDescriptor: val.spread } });
    }
    return result;
  });
  return result;
};
