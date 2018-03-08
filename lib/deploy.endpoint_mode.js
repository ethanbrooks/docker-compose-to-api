// Converts the input into the expected format.
module.exports = function(input) {
  return (input == "dnsrr") ? "dnsrr" : "vip";
};
