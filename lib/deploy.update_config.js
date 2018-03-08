// Converts the input into the expected format.
module.exports = function(input) {
  var result = {};

  if ('parallelism' in input) {
    result.Parallelism = input['parallelism'];
  }

  if ('order' in input) {
    result.Order = input['order'] == 'start-first' ? 'start-first' : 'stop-first';
  }

  if ('failure_action' in input) {
    switch (input['failure_action']) {
      case 'continue':
        result.FailureAction = 'continue';
        break;
      case 'rollback':
        result.FailureAction = 'rollback';
        break;
      default:
        result.FailureAction = "pause";
    }
  }

  if ('delay' in input) {
    result.Delay = require('ms')(input['delay']) * 1000; // Convert to microseconds
  }

  if ('max_failure_ratio' in input) {
    result.MaxFailureRatio = input['max_failure_ratio'];
  }

  if ('monitor' in input) {
    result.Monitor = require('ms')(input['monitor']) * 1000; // Convert to microseconds
  }

  return result;
};
