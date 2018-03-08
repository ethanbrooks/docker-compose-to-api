// Converts the input into the expected format.
module.exports = function(input) {
  var result = {};

  if ('condition' in input) {
    switch (input['condition']) {
      case 'on-failure':
        result.Condition = 'on-failure';
        break;
      case 'always':
        result.Condition = 'any';
        break;
      default:
        result.Condition = "none";
    }
  }

  if ('delay' in input) {
    result.Delay = require('ms')(input['delay']) * 1000; // Convert to microseconds
  }

  if ('max_attempts' in input) {
    result.MaxAttempts = input['max_attempts'];
  }

  if ('window' in input) {
    result.Window = require('ms')(input['window']) * 1000; // Convert to microseconds
  }

  return result;
};
