# Electrode Hapi Compatibility Utility

A utility function that detects the Hapi version and return the appropriate plugin function.

Hapi 17 changed the signature of Plugins. This utility provides a simple wrapper for your plugin to support both Hapi 16 and Hapi 17.

# Usage

```
const {universalHapiPlugin} = require("electrode-hapi-compat");

const registers = {
  hapi16: (server, options, next) => {...},
  hapi17: (server, options) => {...}
};
const pkg = {
  name: "MyPackage",
  version: "1.0.0"
};

module.exports = universalHapiPlugin(registers, pkg);
```

Specify the Hapi 16 and Hapi 17 plugins. This utility reads the Hapi version and returns the appropriate register function.

## Checking for Hapi 17

```js
const {isHapi17} = require("electrode-hapi-compat");

if(isHapi17()) {
// hapi 17
} else {
// hapi 16
}
```

## Checking for Hapi 18

```js
// this is to identify if @hapi/hapi v18 and above
const {isHapi18OrUp} = require("electrode-hapi-compat");

if(isHapi18OrUp()) {
// @hapi/hapi >= 18
} else {
// hapi 16/17
}
```

## Testing
To test a module that uses this library, use the `_testSetHapi17()` function.

```js
const {_testSetHapi17} = require("electrode-hapi-compat");

it("Test Hapi 17", () => {
  _testSetHapi17(true);
  delete require.cache["my-module-that-uses-hapi-compat"];
  const module = require("my-module-that-uses-hapi-compat");
  
  // test hapi 17 module
  module.isHapi17();    // true
});
```
```_testSetHapi18()``` would do the same as above but for @hapi/hapi v18 and above

Note the function needs to be called before you import the library.  Also delete your require cache for that library.


# Install

```bash
$ npm install --save electrode-hapi-compat
```

# Contribute

1. Clone this repo
2. Make updates
3. Run tests (requires 100% test coverage)
4. Submit PR
5. Sign CLA

To run tests

```bash
$ npm run test
```

Built with :heart: by [Team Electrode](https://github.com/orgs/electrode-io/people) @WalmartLabs.

[hapi]: https://www.npmjs.com/package/hapi
