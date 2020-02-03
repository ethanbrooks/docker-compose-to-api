// Converts the input into the expected format.
function resourceObject(input) {
  const result = {};
  const bytes = require('bytes');

  if ('cpus' in input) {
    result.NanoCPUs = parseFloat(input.cpus, 10) * 1000000000;
  }
  if ('memory' in input) {
    let memory = input.memory;
    if (memory.endsWith('K')) memory += 'B';
    if (memory.endsWith('M')) memory += 'B';
    if (memory.endsWith('G')) memory += 'B';

    result.MemoryBytes = bytes.parse(memory);
  }

  return result;
}

module.exports = function(input) {
  const result = {};

  if ('limits' in input) {
    result.Limits = resourceObject(input.limits);
  }
  if ('reservations' in input) {
    result.Reservations = resourceObject(input.reservations);
  }

  return result;
};
