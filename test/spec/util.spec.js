"use strict";

const hapi = require("hapi");
const mockRequire = require("mock-require");
const compat = require("../..");

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
    delete require.cache[require.resolve("../..")];
    mockRequire.stopAll();
  });

  it("test index", () => {
    index = require("../..");
    expect(index.isHapi17()).false;
  });

  it("test is hapi 17", () => {
    mockRequire("hapi/package", { version: "17.2.2" });
    index = require("../..");
    expect(index.isHapi17()).true;
  });

  it("test is not hapi 17", () => {
    index = require("../..");
    expect(index.isHapi17()).false;
  });

  it("test allow tests to set isHapi17 flag", () => {
    index = require("../..");
    expect(index.isHapi17()).false;
    index._testSetHapi17(true);
    expect(index.isHapi17()).true;
  });

  it("test allow tests to set isFastify flag", () => {
    index = require("../..");
    expect(index.isFastify()).false;
    index._testSetFastify(true);
    expect(index.isFastify()).true;
  });

  it("test is hapi 18", () => {
    mockRequire("@hapi/hapi/package", { version: "18.3.2" });
    index = require("../..");
    expect(index.isHapi18OrUp()).true;
  });

  it("test is not hapi 18", () => {
    index = require("../..");
    expect(index.isHapi18OrUp()).false;
  });

  it("test is not fastify", () => {
    index = require("../..");
    expect(index.isFastify()).false;
  });

  it("test is fastify", () => {
    mockRequire("fastify/package", {});
    index = require("../..");
    expect(index.isFastify()).true;
  });

  it("test allow tests to set isHapi18 flag", () => {
    index = require("../..");
    expect(index.isHapi18OrUp()).false;
    index._testSetHapi18(true);
    expect(index.isHapi18OrUp()).true;
  });

  it("test no hapi, defaults hapi 16", () => {
    //mockRequire("@hapi/hapi/package", null);
    mockRequire("hapi/package", null);
    index = require("../..");
    expect(index.isHapi17()).false;
  });

  it("test universalHapiPlugin on Fastify", () => {
    mockRequire("fastify/package", {});
    index = require("../..");
    const registers = {
      hapi16: () => {},
      hapi17: () => {},
      fastify: () => {}
    };
    const pkg = { name: "Green" };
    const plugin = index.universalHapiPlugin(registers, pkg);
    expect(plugin).equal(registers.fastify);
  });

  it("test universalHapiPlugin when no Fastify version", () => {
    mockRequire("fastify/package", {});
    index = require("../..");
    const registers = {
      hapi16: () => {},
      hapi17: () => {}
    };
    const pkg = { name: "Green" };
    const plugin = () => index.universalHapiPlugin(registers, pkg);
    expect(plugin).to.throw("Plugin is not compatible with fastify");
  });

  it("test universalHapiPlugin on Hapi 16", () => {
    index = require("../..");
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
    index = require("../..");
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
    index = require("../..");
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
    index = require("../..");
    const registers = {
      hapi16: () => false,
      hapi17OrUp: () => true
    };
    const pkg = { name: "Yellow" };
    const plugin = index.universalHapiPlugin(registers, pkg);
    expect(plugin.pkg).equal(pkg);
    expect(plugin.register).equal(registers.hapi17OrUp);
  });

  it("_testSetHapi17 should set version to 17 for true", () => {
    compat.hapiVersion = 18;
    compat._testSetHapi17(true);
    expect(compat.hapiVersion).equals(17);
  });

  it("_testSetHapi17 should set version to 16 for 17 and false", () => {
    compat.hapiVersion = 17;
    compat._testSetHapi17(false);
    expect(compat.hapiVersion).equals(16);
  });

  it("_testSetHapi17 should do nothing for version !== 17 and false", () => {
    compat.hapiVersion = 18;
    compat._testSetHapi17(false);
    expect(compat.hapiVersion).equals(18);
  });

  it("_testSetHapi18 should set version to 18 for true", () => {
    compat.hapiVersion = 16;
    compat._testSetHapi18(true);
    expect(compat.hapiVersion).equals(18);
  });

  it("_testSetHapi18 should set version to 17 for 18 and false", () => {
    compat.hapiVersion = 18;
    compat._testSetHapi18(false);
    expect(compat.hapiVersion).equals(17);
  });

  it("_testSetHapi18 should do nothing for version !== 18 and false", () => {
    compat.hapiVersion = 16;
    compat._testSetHapi18(false);
    expect(compat.hapiVersion).equals(16);
  });
});
