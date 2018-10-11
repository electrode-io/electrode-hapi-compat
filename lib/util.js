"use strict";
/* eslint-disable global-require */

const HAPI16 = 16;
const HAPI17 = 17;

function hapiMajor() {
  let hapiPkg;
  try {
    hapiPkg = require("hapi/package");
  } catch (err) {
    // ignore
  }
  return hapiPkg ? +hapiPkg.version.split(".")[0] : HAPI16;
}
let _isHapi17 = hapiMajor() >= HAPI17;

function isHapi17() {
  return _isHapi17;
}

function _testSetHapi17(isHapi17Flag) {
  _isHapi17 = isHapi17Flag;
}

/**
 * Detects the installed Hapi version and use the appropriate plugin
 *
 * @param {*} registers: { hapi16, hapi17 } contains registers for hapi16, hapi17
 * @param {*} pkg : package for a hapi plugin
 * @returns {*}: Hapi plugin appropriate for installed version
 *
 */
function universalHapiPlugin(registers, pkg) {
  if (isHapi17()) {
    return {
      register: registers.hapi17,
      pkg
    };
  } else {
    registers.hapi16.attributes = {
      pkg
    };
    return registers.hapi16;
  }
}

module.exports = {
  isHapi17,
  universalHapiPlugin,
  _testSetHapi17
};
