'use strict';
const yaml = require('js-yaml');

/**
 * This library is responsible for generating an engine spec compatible with Docker Engine v1.36
 * from a docker-compose formatted YAML file (version 3).
 */

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
    spec.TaskTemplate.ContainerSpec['Command'] = require('./command')(input[name]['command']);
  }

  if ('environment' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Env'] = require('./environment')(input[name]['environment']);
  }

  // Container-level labels. For service labels, see 'deploy.labels'.
  if ('labels' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Labels'] = require('./labels.js')(input[name]['labels']);
  }

  if ('deploy' in input[name]) {
    if ('endpoint_mode' in input[name]['deploy']) {
      spec.TaskTemplate.EndpointSpec = spec.TaskTemplate.EndpointSpec || {};
      spec.TaskTemplate.EndpointSpec['Mode'] = require('./deploy.endpoint_mode.js')(input[name]['deploy']['endpoint_mode']);
    }

    // Service-level labels.
    if ('labels' in input[name]['deploy']) {
      spec['Labels'] = require('./labels.js')(input[name]['deploy']['labels']);
    }

    if ('placement' in input[name]['deploy']) {
      if ('constraints' in input[name]['deploy']['placement']) {
        spec.TaskTemplate.Placement = spec.TaskTemplate.Placement || {};
        spec.TaskTemplate.Placement['Constraints'] = input[name]['deploy']['placement'];
      }

      if ('preferences' in input[name]['deploy']['placement']) {
        spec.TaskTemplate.Placement = spec.TaskTemplate.Placement || {};
        spec.TaskTemplate.Placement['Preferences'] = require('./deploy.placement.preferences.js')(input[name]['deploy']['placement']['preferences']);
      }
    }
  }

  if ('configs' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Configs'] = require('./configs.js')(input[name]['configs']);
  }

  if ('secrets' in input[name]) {
    spec.TaskTemplate.ContainerSpec['Secrets'] = require('./secrets.js')(input[name]['secrets']);
  }

  if ('volumes' in input[name] && input[name]['volumes'].length > 0) {
    spec.TaskTemplate.ContainerSpec['Mounts'] = require('./volumes.js')(input[name]['volumes']);
  }

  if ('ports' in input[name] && input[name]['ports'].length > 0) {
    spec.TaskTemplate.EndpointSpec = spec.TaskTemplate.EndpointSpec || {};
    spec.TaskTemplate.EndpointSpec['Ports'] = require('./ports.js')(input[name]['ports']);
  }

  if ('restart' in input[name]) {
    spec.TaskTemplate['RestartPolicy'] = require('./restart.js')(input[name]['restart']);
  }

  return spec;
}

module.exports = dockerComposeToApi;
