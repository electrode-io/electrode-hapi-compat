"use strict";
/* eslint-disable global-require */
function tryRequire(file) {
  try {
    return require(file);
  } catch (err) {
    return undefined;
  }
}

module.exports = tryRequire;
