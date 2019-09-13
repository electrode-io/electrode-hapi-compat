"use strict";
/* eslint-disable global-require */
function tryRequire(file) {
  let fileContent;
  try {
    fileContent = require(file);
  } catch (err) {
    // ignore
  }
  return fileContent;
}

module.exports = tryRequire;
