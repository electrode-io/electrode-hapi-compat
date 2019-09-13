"use strict";
/* eslint-disable global-require */
const isValidObject = require("./is-valid-object");
const tryRequire = require("./try-require");

const HAPI16 = 16;
const HAPI17 = 17;
const HAPI18 = 18;

function hapiMajor() {
  let hapiPkg = tryRequire("@hapi/hapi/package");
  if (!hapiPkg) {
    hapiPkg = tryRequire("hapi/package");
  }

  if (isValidObject(hapiPkg) && hapiPkg.version) {
    return +hapiPkg.version.split(".")[0];
  }

  return HAPI16;
}

const hapiV = hapiMajor();
let _isHapi17 = hapiV >= HAPI17;
let _isHapi18 = hapiV >= HAPI18;

function isHapi17() {
  return _isHapi17;
}

function isHapi18OrUp() {
  return _isHapi18;
}

function _testSetHapi17(isHapi17Flag) {
  _isHapi17 = isHapi17Flag;
}

function _testSetHapi18(isHapi18Flag) {
  _isHapi18 = isHapi18Flag;
}

/**
 * Detects the installed Hapi version and use the appropriate plugin
 *
 * @param {*} registers: { hapi16, hapi17 } contains registers for hapi16, hapi17/18
 * @param {*} pkg : package for a hapi plugin
 * @returns {*}: Hapi plugin appropriate for installed version
 *
 */
function universalHapiPlugin(registers, pkg) {
  if (_isHapi17 || _isHapi18) {
    return {
      register: registers.hapi17OrUp || registers.hapi17,
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
  hapiMajor,
  isHapi17,
  isHapi18OrUp,
  universalHapiPlugin,
  _testSetHapi17,
  _testSetHapi18
};
