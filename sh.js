'use strict';

const path = require('path');

var cmd = {};

cmd._ = function(msg, resp) {
  const xProcess = require('xcraft-core-process')({
    logger: 'xlog',
    resp,
  });

  var bin = msg.data.command;
  var args = msg.data.args;

  xProcess.spawn(bin, args, {}, function(err) {
    if (err) {
      resp.log.err(err);
    }

    resp.events.send(`sh._.${msg.id}.finished`);
  });
};

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function() {
  const xUtils = require('xcraft-core-utils');
  return {
    handlers: cmd,
    rc: xUtils.json.fromFile(path.join(__dirname, './rc.json')),
  };
};
