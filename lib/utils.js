"use strict";
const Path = require("path");

function tryResolve(file) {
  try {
    return require.resolve(file);
  } catch (err) {
    return undefined;
  }
}

function showWarning(...args) {
  console.warn(...args); // eslint-disable-line
}

function findNodeModules(path) {
  const index = Path.dirname(path).indexOf("node_modules");
  const dir = path.substring(0, index);
  return { index, dir };
}

module.exports = {
  tryResolve,
  showWarning,
  findNodeModules,
  xrequire: require
};
