# Electorde Hapi Compatibility Utility

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
