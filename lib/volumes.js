// Converts the input into the expected format.
module.exports = function(input) {
  var result = [];

  input.map((volume) => {
    if (typeof volume === 'string') {
      // Short syntax
      var sourcePath = volume.split(':');
      var mount = {
        Type: 'bind',
        Source: sourcePath[0]
      };
      if (sourcePath.length > 2) {
        if (sourcePath[2] == 'ro') {
          mount['ReadOnly'] = true;
        }
      }
      if (sourcePath.length > 1) {
        mount['Target'] = sourcePath[1];
      }
      result.push(mount);
    } else {
      // Long syntax
      var mount = {
        Type: volume['type']
      };
      if ('source' in volume) mount['Source'] = volume['source'];
      if ('target' in volume) mount['Target'] = volume['target'];
      if ('read_only' in volume) mount['ReadOnly'] = volume['read_only'];
      if ('bind' in volume && 'propagation' in volume['bind']) {
        mount['BindOptions'] = {
          Propagation: volume['bind']['propagation']
        };
      }
      if ('volume' in volume && 'nocopy' in volume['volume']) {
        mount['VolumeOptions'] = {
          NoCopy: volume['volume']['nocopy']
        };
      }
      if ('tmpfs' in volume && 'size' in volume['tmpfs']) {
        mount['TmpfsOptions'] = {
          SizeBytes: volume['tmpfs']['size']
        };
      }
      result.push(mount);
    }
  });

  return result;
};
