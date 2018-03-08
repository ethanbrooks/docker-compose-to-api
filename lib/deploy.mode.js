// Converts the input into the expected format.
module.exports = function(mode, replicas) {
  var result = {};

  if (mode == "replicated") {
    result.Replicated = {
      Replicas: replicas
    };
  }

  return result;
};
