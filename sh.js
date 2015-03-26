'use strict';

var moduleName = 'bin';

var path = require ('path');

var xLog      = require ('xcraft-core-log') (moduleName);
var xProcess  = require ('xcraft-core-process');
var busClient = require ('xcraft-core-busclient');

var cmd = {};

cmd.$ = function (msg) {
  var bin  = msg.data.command;
  var args = msg.data.args;

  xProcess.spawn (bin, args, {}, function (err) {
    if (err) {
      xLog.err (err);
    }

    busClient.events.send ('sh.$.finished');
  });
};

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function () {
  return {
    handlers: cmd,
    rc: path.join (__dirname, './rc.json')
  };
};
