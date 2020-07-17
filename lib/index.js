"use strict";

/* eslint-disable no-magic-numbers, no-unused-expressions */

const utils = require("./utils");

function isPathAlignedToMe(path, myDir = __dirname) {
  //
  // this ensures that when we look for packages like fastify, hapi, @hapi/hapi, that
  // they are under the same node_modules as us.
  // If not, then the user may have accidentally left a node_modules in a dir above us
  // and cause us to resolve it, and mistakenly detect that something is installed.
  //
  const { dir: dir1 } = utils.findNodeModules(myDir);
  const { index: ix2, dir: dir2 } = utils.findNodeModules(path);

  let reason;
  if (ix2 < 0) {
    reason = "is found in a dir that's not under any node_modules";
  } else if (dir1 !== dir2) {
    if (dir1.startsWith(dir2)) {
      reason = "is found in a node_modules in a dir above app's dir";
    } else {
      reason = "is found in a node_modules in a dir outside of app's dir";
    }
  }

  if (reason) {
    return { reason, dir1, dir2 };
  }

  return true;
}

function checkPath(name, path) {
  const aligned = isPathAlignedToMe(path);
  aligned !== true &&
    utils.showWarning(`
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!
! WARNING: ${name} ${aligned.reason}
!
! - ${name} found in node_modules in ${aligned.dir2}
! - Your app's node_modules is in ${aligned.dir1}
!
! This may cause your plugin registrations to fail with strange errors.
!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
`);
}

let HAPI_MAJOR_VERSION;
let FASTIFY;

function hapiMajor() {
  if (HAPI_MAJOR_VERSION === undefined) {
    HAPI_MAJOR_VERSION = 16;

    let hapiPackagePath = "";
    const hapi = ["@hapi/hapi/package", "hapi/package"].find(x => {
      return (hapiPackagePath = utils.tryResolve(x));
    });

    if (hapiPackagePath) {
      checkPath(hapi, hapiPackagePath);
      const hapiPkg = utils.xrequire(hapiPackagePath); // eslint-disable-line
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

function isFastify() {
  if (FASTIFY === undefined) {
    const pkg = "fastify/package";
    const fastifyPath = utils.tryResolve(pkg);
    if (fastifyPath) {
      checkPath(pkg, fastifyPath);
      FASTIFY = true;
    } else {
      FASTIFY = false;
    }
  }
  return FASTIFY;
}

function _testSetHapi17(isHapi17Flag) {
  if (isHapi17Flag) {
    HAPI_MAJOR_VERSION = 17;
  } else if (hapiMajor() === 17) {
    HAPI_MAJOR_VERSION = 16;
  }
}

function _testSetHapi18(isHapi18Flag) {
  if (isHapi18Flag) {
    HAPI_MAJOR_VERSION = 18;
  } else if (hapiMajor() === 18) {
    HAPI_MAJOR_VERSION = 17;
  }
}

function _testSetFastify(isFastifyFlag) {
  FASTIFY = isFastifyFlag;
}

/**
 * Detects the installed Hapi version and use the appropriate plugin
 *
 * @param {Object} registers: { hapi16, hapi17 } contains registers for hapi16, hapi17/18
 * @param {*|undefined} registers.fastify: optional field for fastify plugin
 * @param {*} pkg : package for a hapi plugin
 * @returns {*}: Hapi plugin appropriate for installed version
 *
 */
function universalHapiPlugin(registers, pkg) {
  if (isFastify()) {
    if (!registers.fastify) {
      // Lazily fail if the user tries to register this plugin with fastify.
      return () =>
        Promise.reject(new Error("Plugin is not compatible with fastify"));
    }
    // allow modifying of parent fastify instance
    registers.fastify[Symbol.for("skip-override")] = true;
    return registers.fastify;
  } else if (hapiMajor() >= 17) {
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
  isPathAlignedToMe,
  _testSetHapi17,
  _testSetHapi18,
  _testSetFastify,
  isHapi17,
  isFastify
};

Object.defineProperty(module.exports, "hapiVersion", {
  get: () => hapiMajor(),
  set: v => (HAPI_MAJOR_VERSION = v)
});
