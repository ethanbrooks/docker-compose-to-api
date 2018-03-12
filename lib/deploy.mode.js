// Converts the input into the expected format.
module.exports = function(mode, replicas) {
  var result = {};

  if (mode == "replicated") {
    result.Replicated = {
      Replicas: replicas
    };
  } else if (mode == "global") {
    result.Global = {
      Enabled: true
    }
  }

  return result;
};
