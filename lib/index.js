'use strict';
const yaml = require('js-yaml');

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function dockerComposeToApi(input) {
  if (typeof input === "string") {
    input = yaml.safeLoad(input);
  }

  const name = Object.keys(input)[0];
  let containerName = name;
  if ('container_name' in input[name]) {
    containerName = input[name]['container_name'];
  }

  let spec = {
    Name: containerName,
    TaskTemplate: {
      ContainerSpec: {
        Image: input[name]['image']
      }
    }
  };

  if ('command' in input[name]) {
    if (Array.isArray(input[name]['command'])) {
      spec.TaskTemplate.ContainerSpec['Command'] = input[name]['command'];
    } else {
      spec.TaskTemplate.ContainerSpec['Command'] = [ input[name]['command'] ];
    }
  }

  if ('environment' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Env'] = [];

    // Convert { test: 1 } to 'test=1' format.
    for (var key in input[name]['environment']) {
      spec.TaskTemplate.ContainerSpec['Env'].push(key + "=" + input[name]['environment'][key]);
    }
  }

  if ('labels' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Labels'] = {};
    // Labels can come in both array and dictionary format.
    if (isNumeric(Object.keys(input[name]['labels'])[0])) {
      // Array format
      for (var i = 0; i < input[name]['labels'].length; i++) {
        const parts = input[name]['labels'][i].split("=");
        if (parts.length == 2) {
          spec.TaskTemplate.ContainerSpec['Labels'][parts[0]] = parts[1];
        }
      }
    } else {
      // Dictionary format
      spec.TaskTemplate.ContainerSpec['Labels'] = input[name]['labels'];
    }
  }

  if ('configs' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Configs'] = [];
    for (var key in input[name]['configs']) {
      if ('file' in input[name]['configs'][key]) {
        spec.TaskTemplate.ContainerSpec['Configs'].push({
          ConfigID: key,
          ConfigName: key,
          File: input[name]['configs'][key].file
        });
      }
    }
  }

  if ('secrets' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Secrets'] = [];
    for (var key in input[name]['secrets']) {
      if ('file' in input[name]['secrets'][key]) {
        spec.TaskTemplate.ContainerSpec['Secrets'].push({
          SecretID: key,
          SecretName: key,
          File: input[name]['secrets'][key].file
        });
      }
    }
  }

  if ('volumes' in input[name] && input[name]['volumes'].length > 0) {
    spec.TaskTemplate.ContainerSpec['Mounts'] = [];
    for (var i = 0; i < input[name]['volumes'].length; i++) {
      if (typeof input[name]['volumes'][i] === 'string') {
        // Short syntax
        var sourcePath = input[name]['volumes'][i].split(':');
        var volume = {
          Type: 'volume',
          Source: sourcePath[0]
        };
        if (sourcePath.length > 2) {
          if (sourcePath[2] == 'ro') {
            volume['ReadOnly'] = true;
          }
        }
        if (sourcePath.length > 1) {
          volume['Target'] = sourcePath[1];
        }
        spec.TaskTemplate.ContainerSpec['Mounts'].push(volume);
      } else {
        // Long syntax
        var volume = {
          Type: input[name]['volumes'][i]['type']
        };
        if ('source' in input[name]['volumes'][i]) volume['Source'] = input[name]['volumes'][i]['source'];
        if ('target' in input[name]['volumes'][i]) volume['Target'] = input[name]['volumes'][i]['target'];
        if ('read_only' in input[name]['volumes'][i]) volume['ReadOnly'] = input[name]['volumes'][i]['read_only'];
        if ('bind' in input[name]['volumes'][i] && 'propagation' in input[name]['volumes'][i]['bind']) {
          volume['BindOptions'] = {
            Propagation: input[name]['volumes'][i]['bind']['propagation']
          };
        }
        if ('volume' in input[name]['volumes'][i] && 'nocopy' in input[name]['volumes'][i]['volume']) {
          volume['VolumeOptions'] = {
            NoCopy: input[name]['volumes'][i]['volume']['nocopy']
          };
        }
        if ('tmpfs' in input[name]['volumes'][i] && 'size' in input[name]['volumes'][i]['tmpfs']) {
          volume['TmpfsOptions'] = {
            SizeBytes: input[name]['volumes'][i]['tmpfs']['size']
          };
        }
        spec.TaskTemplate.ContainerSpec['Mounts'].push(volume);
      }
    }
  }

  return spec;
}

module.exports = dockerComposeToApi;
