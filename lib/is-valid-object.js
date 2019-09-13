"use strict";

function isValidObject(obj) {
  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).length > 0;
  }
  return false;
}

module.exports = isValidObject;
