// Returns true if the input is numeric, false otherwise.
module.exports = function(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
