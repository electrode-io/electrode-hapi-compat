# Electrode Hapi Compatibility Utility

A utility function that detects the Hapi version and return the appropriate plugin function.

Hapi 17 changed the signature of Plugins. This utility provides a simple wrapper for your plugin to support both Hapi 16 and Hapi 17+.

## Export plugin for Hapi 16 or 17+

If you have module that can export plugins for hapi 16 or 17+, you can let this module automatically determine which of your plugins to use depending on the version of Hapi detected using `universalHapiPlugin`.

```js
const {universalHapiPlugin} = require("electrode-hapi-compat");

const registers = {
  hapi16: (server, options, next) => {...},
  hapi17OrUp: (server, options) => {...}
};

const pkg = {
  name: "MyPackage",
  version: "1.0.0"
};

module.exports = universalHapiPlugin(registers, pkg);
```

Specify the Hapi 16 and Hapi 17 plugins. This utility reads the Hapi version and returns the appropriate register function.

## Checking for Hapi 17 or Up

```js
const { isHapi17OrUp } = require("electrode-hapi-compat");

if (isHapi17OrUp()) {
  // hapi 17 or @hapi/hapi >= 18
} else {
  // hapi 16
}
```

## Checking for Hapi 18 or Up

```js
// this is to identify if @hapi/hapi v18 and above
const { isHapi18OrUp } = require("electrode-hapi-compat");

if (isHapi18OrUp()) {
  // @hapi/hapi >= 18
} else {
  // hapi 16/17
}
```

## Manually Setting Version for Testing

If you need to manually force a certain version of Hapi for testing etc,
you can manually set the Hapi major version this module should use with the `hapiVersion` property:

```js
// Set to use Hapi major version 18

require("electrode-hapi-compat").hapiVersion = 18;

// Get Hapi major version

const hapiVersion = require("electrode-hapi-compat").hapiVersion;
```

## Install

```bash
$ npm install --save electrode-hapi-compat
```

## Contribute

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
