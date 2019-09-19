"use strict";

/* eslint-disable no-magic-numbers */

const isValidObject = require("./is-valid-object");
const tryRequire = require("./try-require");

let HAPI_MAJOR_VERSION;

function hapiMajor() {
  if (HAPI_MAJOR_VERSION === undefined) {
    HAPI_MAJOR_VERSION = 16;

    let hapiPkg = tryRequire("@hapi/hapi/package");
    if (!hapiPkg) {
      hapiPkg = tryRequire("hapi/package");
    }

    if (isValidObject(hapiPkg) && hapiPkg.version) {
      HAPI_MAJOR_VERSION = +hapiPkg.version.split(".")[0];
    }
  }

  return HAPI_MAJOR_VERSION;
}

function isHapi17() {
  return hapiMajor() >= 17;
}

function isHapi18OrUp() {
  return hapiMajor() >= 18;
}

function _testSetHapi17(isHapi17Flag) {
  if (isHapi17Flag) {
    HAPI_MAJOR_VERSION = 17;
  } else if (HAPI_MAJOR_VERSION === 17) {
    HAPI_MAJOR_VERSION = 16;
  }
}

function _testSetHapi18(isHapi18Flag) {
  if (isHapi18Flag) {
    HAPI_MAJOR_VERSION = 18;
  } else if (HAPI_MAJOR_VERSION === 18) {
    HAPI_MAJOR_VERSION = 17;
  }
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
  if (hapiMajor() >= 17) {
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
  isHapi17OrUp: isHapi17,
  isHapi18OrUp,
  universalHapiPlugin,
  _testSetHapi17,
  _testSetHapi18,
  isHapi17
};

Object.defineProperty(module.exports, "hapiVersion", {
  get: () => hapiMajor(),
  set: v => (HAPI_MAJOR_VERSION = v)
});
