'use strict';

const privates = require('./private-map');
const loadConfig = require('./config-loader');
// const authenticate = require('./auth');

const projects = require('./projects');

function bindModule (client, input) {
  if (typeof input === 'object') {
    const initializedModule = {};
    for (const name in input) {
      initializedModule[name] = bindModule(client, input[name]);
    }
    return initializedModule;
  } else if (typeof input === 'function') {
    return input(client);
  } else {
    throw new Error(`Unexpected input module type: ${input}`);
  }
}

function openshiftClient (settings) {
  settings = settings || {};

  const data = {};
  const client = {};

  Object.assign(client, bindModule(client, {
    projects: projects
  }));
  // A WeakMap reference to our private data
  // means that when all references to 'client' disappear
  // then the entry will be removed from the map
  privates.set(client, data);

  // Maybe load the config here?
  return loadConfig(client);

  // return a promise that resolves after auth
  // return authenticate(client, settings);
}

module.exports = exports = openshiftClient;