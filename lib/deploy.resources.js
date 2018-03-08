// Converts the input into the expected format.
function ResourceObject(input) {
  var result = {};
  var bytes = require('bytes');

  if ('cpus' in input) {
    result.NanoCPUs = parseFloat(input['cpus'], 10);
  }
  if ('memory' in input) {
    var memory = input['memory'];
    if (memory.endsWith('K')) memory += "B";
    if (memory.endsWith('M')) memory += "B";
    if (memory.endsWith('G')) memory += "B";

    result.MemoryBytes = bytes.parse(memory);
  }

  return result;
}

module.exports = function(input) {
  var result = {};

  if ('limits' in input) {
    result.Limits = ResourceObject(input['limits']);
  }
  if ('reservations' in input) {
    result.Reservations = ResourceObject(input['reservations']);
  }

  return result;
};
