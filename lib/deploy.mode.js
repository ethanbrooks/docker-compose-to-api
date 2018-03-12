// Converts the input into the expected format.
module.exports = function(mode, options) {
  var result = {};
  options = options || {};

  if (mode == "replicated" && 'Replicas' in options) {
    result.Replicated = {
      Replicas: options.Replicas
    };
  } else if (mode == "global") {
    result.Global = {
      Enabled: true
    }
  }

  return result;
};
