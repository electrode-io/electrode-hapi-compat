"use strict";

function isValidObject(obj) {
  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).length;
  }
  return false;
}

module.exports = isValidObject;
