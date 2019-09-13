"use strict";

const hapi = require("hapi");
const mockRequire = require("mock-require");

describe("Util", () => {
  let index;
  let hapiServer;

  beforeEach(() => {
    hapiServer = new hapi.Server();
    hapiServer.connection({ port: 80 });
    hapiServer.route({
      method: "GET",
      path: "/test",
      handler: (req, reply) => {
        return reply("ok");
      }
    });
  });

  afterEach(() => {
    hapiServer.stop();
    delete require.cache[require.resolve("../../lib/util")];
    mockRequire.stopAll();
  });

  it("test index", () => {
    index = require("../..");
    expect(index.isHapi17()).false;
  });

  it("test is hapi 17", () => {
    mockRequire("hapi/package", { version: "17.2.2" });
    index = require("../../lib/util");
    expect(index.isHapi17()).true;
  });

  it("test is not hapi 17", () => {
    index = require("../../lib/util");
    expect(index.isHapi17()).false;
  });
  it("test allow tests to set isHapi17 flag", () => {
    index = require("../../lib/util");
    expect(index.isHapi17()).false;
    index._testSetHapi17(true);
    expect(index.isHapi17()).true;
  });

  it("test is hapi 18", () => {
    mockRequire("@hapi/hapi/package", { version: "18.3.2" });
    index = require("../../lib/util");
    expect(index.isHapi18OrUp()).true;
  });

  it("test is not hapi 18", () => {
    index = require("../../lib/util");
    expect(index.isHapi18OrUp()).false;
  });
  it("test allow tests to set isHapi18 flag", () => {
    index = require("../../lib/util");
    expect(index.isHapi18OrUp()).false;
    index._testSetHapi18(true);
    expect(index.isHapi18OrUp()).true;
  });

  it("test no hapi, defaults hapi 16", () => {
    //mockRequire("@hapi/hapi/package", null);
    mockRequire("hapi/package", null);
    index = require("../../lib/util");
    expect(index.isHapi17()).false;
  });

  it("test universalHapiPlugin on Hapi 16", () => {
    index = require("../../lib/util");
    const registers = {
      hapi16: () => true,
      hapi17: () => false
    };
    const pkg = { name: "Green" };
    const plugin = index.universalHapiPlugin(registers, pkg);
    expect(plugin.attributes.pkg).equal(pkg);
    expect(plugin).equal(registers.hapi16);
  });

  it("test universalHapiPlugin on Hapi 17", () => {
    mockRequire("hapi/package", { version: "17.0.0" });
    index = require("../../lib/util");
    const registers = {
      hapi16: () => false,
      hapi17: () => true
    };
    const pkg = { name: "Yellow" };
    const plugin = index.universalHapiPlugin(registers, pkg);
    expect(plugin.pkg).equal(pkg);
    expect(plugin.register).equal(registers.hapi17);
  });

  it("test universalHapiPlugin on Hapi 18, using registers.hapi17", () => {
    mockRequire("hapi/package", { version: "18.3.2" });
    index = require("../../lib/util");
    const registers = {
      hapi16: () => false,
      hapi17: () => true
    };
    const pkg = { name: "Yellow" };
    const plugin = index.universalHapiPlugin(registers, pkg);
    expect(plugin.pkg).equal(pkg);
    expect(plugin.register).equal(registers.hapi17);
  });

  it("test universalHapiPlugin on Hapi 18, using registers.hapi17OrUp", () => {
    mockRequire("hapi/package", { version: "18.3.2" });
    index = require("../../lib/util");
    const registers = {
      hapi16: () => false,
      hapi17OrUp: () => true
    };
    const pkg = { name: "Yellow" };
    const plugin = index.universalHapiPlugin(registers, pkg);
    expect(plugin.pkg).equal(pkg);
    expect(plugin.register).equal(registers.hapi17OrUp);
  });
});
