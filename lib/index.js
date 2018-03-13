'use strict';
const yaml = require('js-yaml');
const Joi = require('joi');
const { serviceSchema } = require('joi-docker-compose');

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

  let validation = Joi.validate(input, serviceSchema);
  if (validation.error) throw validation.error;

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
    spec.TaskTemplate.ContainerSpec['Args'] = require('./command')(input[name]['command']);
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
      spec.EndpointSpec = spec.EndpointSpec || {};
      spec.EndpointSpec['Mode'] = require('./deploy.endpoint_mode.js')(input[name]['deploy']['endpoint_mode']);
    }

    if ('restart_policy' in input[name]['deploy']) {
      spec.TaskTemplate.RestartPolicy = require('./deploy.restart_policy.js')(input[name]['deploy']['restart_policy']);
    }

    if ('update_config' in input[name]['deploy']) {
      spec.UpdateConfig = require('./deploy.update_config.js')(input[name]['deploy']['update_config']);
    }

    var deployMode = ('mode' in input[name]['deploy']) ? input[name]['deploy']['mode'] : 'replicated';
    var modeOptions = {};
    if ('replicas' in input[name]['deploy']) {
      modeOptions.Replicas = parseInt(input[name]['deploy']['replicas'], 10);
    }
    spec.Mode = require('./deploy.mode.js')(deployMode, modeOptions);

    if ('resources' in input[name]['deploy']) {
      spec.TaskTemplate.Resources = require('./deploy.resources.js')(input[name]['deploy']['resources']);
    }

    // Service-level labels.
    if ('labels' in input[name]['deploy']) {
      spec['Labels'] = require('./labels.js')(input[name]['deploy']['labels']);
    }

    if ('placement' in input[name]['deploy']) {
      spec.TaskTemplate.Placement = spec.TaskTemplate.Placement || {};

      if ('constraints' in input[name]['deploy']['placement']) {
        spec.TaskTemplate.Placement['Constraints'] = input[name]['deploy']['placement']['constraints'];
      }

      if ('preferences' in input[name]['deploy']['placement']) {
        spec.TaskTemplate.Placement['Preferences'] = require('./deploy.placement.preferences.js')(input[name]['deploy']['placement']['preferences']);
      }
    }
  }

  if ('networks' in input[name]) {
    spec.TaskTemplate['Networks'] = require('./networks')(input[name]['networks']);
  }

  if ('volumes' in input[name] && input[name]['volumes'].length > 0) {
    spec.TaskTemplate.ContainerSpec['Mounts'] = require('./volumes.js')(input[name]['volumes']);
  }

  if ('ports' in input[name] && input[name]['ports'].length > 0) {
    spec.EndpointSpec = spec.EndpointSpec || {};
    spec.EndpointSpec['Ports'] = require('./ports.js')(input[name]['ports']);
  }

  return spec;
}

module.exports = dockerComposeToApi;
