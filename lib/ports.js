// Converts the input into the expected format.
module.exports = function(input) {
  const result = [];

  for (let i = 0; i < input.length; i++) {
    if (typeof input[i] === 'string' || require('./isNumeric')(input[i])) {
      // Short syntax
      const portSplit = input[i].toString().split(':'); // 8080:80 -> [8080, 80]
      const protocolSplit = input[i].toString().split('/'); // 8080:80/udp -> [8080:80, udp]
      const port = {
        Protocol: 'tcp',
      };
      // Check to see if the port is in HOST:CONTAINER format or CONTAINER format.
      if (portSplit.length > 1) {
        port.PublishedPort = portSplit[0];
        port.TargetPort = portSplit[1];
      } else {
        port.TargetPort = portSplit[0];
      }
      // Check to see if a protocol was provided.
      if (protocolSplit.length > 1) {
        port.Protocol = protocolSplit[1];
        port.TargetPort = port.TargetPort.split('/')[0];
      }

      if ('PublishedPort' in port) port.PublishedPort = parseInt(port.PublishedPort, 10);
      if ('TargetPort' in port) port.TargetPort = parseInt(port.TargetPort, 10);

      result.push(port);
    } else {
      // Long syntax
      const port = {};
      if ('protocol' in input[i]) port.Protocol = input[i].protocol;
      if ('target' in input[i]) port.TargetPort = parseInt(input[i].target, 10);
      if ('published' in input[i]) port.PublishedPort = parseInt(input[i].published, 10);
      if ('mode' in input[i]) port.PublishMode = input[i].mode;

      result.push(port);
    }
  }

  return result;
};
