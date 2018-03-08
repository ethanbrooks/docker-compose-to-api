'use strict';
const dockerComposeToApi = require('../lib/index');
const tap = require('tap');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const validator = require('joi-docker-engine');

tap.test('dockerComposeToApi should be a function', (t) => {
  t.equal(typeof dockerComposeToApi, 'function');
  t.end();
});

tap.test('dockerComposeToApi handles container_name', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.name.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.Name, 'cool-auth');
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi works with a passed in object', (t) => {
  var engineSpec = dockerComposeToApi({
    auth: {
      image: 'test',
      container_name: 'cool-auth'
    }
  });
  t.deepEqual(engineSpec.Name, 'cool-auth');
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles network as object', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.network.object.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.Networks, [
    {
      Target: 'first-network',
      Aliases: ['alias1', 'alias2']
    },
    {
      Target: 'second-network',
      Aliases: ['alias3', 'alias4']
    }
  ]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles network as array', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.network.array.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.Networks, [
    {
      Target: 'first-network',
      Aliases: []
    },
    {
      Target: 'second-network',
      Aliases: []
    }
  ]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles label as object', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.label.object.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Labels, { 'test': 'one', 'fire': 'everything' });
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles label as array', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.label.array.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Labels, { 'test': 'one', 'fire': 'everything' });
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles command as array', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.command.array.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Command, ['bundle', 'exec', 'npm', 'test']);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles command as string', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.command.string.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Command, ['bundle exec npm test']);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles environment variables as object', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.environment.object.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Env, ['APP_NAME=micro-auth','REDIRECT_URL=/info']);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles environment variables as array', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.environment.array.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Env, ['APP_NAME=micro-auth','REDIRECT_URL=/info']);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles configs', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.configs.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Configs, [{ ConfigID: 'main_config', ConfigName: 'main_config', File: "./main_config.txt"}]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles secrets', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.secrets.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Secrets, [{ SecretID: 'main_secret', SecretName: 'main_secret', File: "./main_secret.txt"}]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles deploy', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.deploy.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec, {
    Labels: {
      "one": "two",
      "three": "four"
    },
    Mode: {
      Replicated: { Replicas: 6 }
    },
    Name: "auth",
    EndpointSpec: {
      Mode: "vip"
    },
    TaskTemplate: {
      ContainerSpec: {
        Image: "firstandthird/node:8.9-2-dev"
      },
      Placement: {
        Constraints: ['node.role == manager', 'engine.labels.operatingsystem == ubuntu 14.04'],
        Preferences: [{ Spread: { SpreadDescriptor: 'node.labels.zone' }}]
      },
      Resources: {
        Limits: {
          NanoCPUs: 0.5,
          MemoryBytes: 52428800
        },
        Reservations: {
          NanoCPUs: 0.25,
          MemoryBytes: 20971520
        }
      },
      RestartPolicy: {
        Condition: 'on-failure',
        Delay: 5000000,
        MaxAttempts: 3,
        Window: 120000000
      }
    },
    UpdateConfig: {
      Parallelism: 2,
      Delay: 10000000,
      FailureAction: 'continue',
      Monitor: 2000000,
      MaxFailureRatio: 0.125,
      Order: 'stop-first'
    }
  });
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles array syntax for volume', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.volume.array.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Mounts, [
    {
      Source: ".",
      Target: "/home/app/src",
      Type: "volume",
    },
    {
      ReadOnly: true,
      Source: "./test",
      Target: "/home/app/test",
      Type: "volume"
    },
    {
      Source: "/home/app/static",
      Type: "volume"
    }
  ]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles object syntax for volume', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.volume.object.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.TaskTemplate.ContainerSpec.Mounts, [
    {
      Source: ".",
      Target: "/home/app/src",
      Type: "volume",
      ReadOnly: false,
      VolumeOptions: {
        NoCopy: false
      }
    },
    {
      Source: "./static",
      Target: "/home/app/static",
      Type: "bind",
      BindOptions: {
        Propagation: 'shared'
      }
    },
    {
      Type: 'tmpfs',
      Target: '/home/app/tmp',
      TmpfsOptions: {
        SizeBytes: 1024
      }
    }
  ]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles array syntax for port', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.port.array.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.EndpointSpec.Ports, [
    {
      Protocol: 'tcp',
      TargetPort: '8080'
    },
    {
      Protocol: 'tcp',
      TargetPort: '81',
      PublishedPort: '8081'
    },
    {
      Protocol: 'udp',
      TargetPort: '30',
      PublishedPort: '5000'
    }
  ]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});

tap.test('dockerComposeToApi handles object syntax for port', (t) => {
  var yaml = fs.readFileSync(path.join(__dirname, 'fixtures' , 'service.port.object.yml'), { encoding: 'utf8'});
  var engineSpec = dockerComposeToApi(yaml);
  t.deepEqual(engineSpec.EndpointSpec.Ports, [
    {
      Protocol: 'tcp',
      TargetPort: '8080'
    },
    {
      Protocol: 'tcp',
      TargetPort: '81',
      PublishedPort: '8081',
      PublishMode: 'host'
    },
    {
      Protocol: 'udp',
      TargetPort: '30',
      PublishedPort: '5000',
      PublishMode: 'ingress'
    }
  ]);
  t.equal(Joi.validate(engineSpec, validator).error, null);
  t.end();
});
