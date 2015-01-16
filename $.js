'use strict';
/* Xcraft core bin shell extensions */

var path = require ('path');
var fs   = require ('fs');

var xFs       = require ('xcraft-core-fs');
var xUtils    = require ('xcraft-core-utils');
var xPlatform = require ('xcraft-core-platform');
var busClient = require ('xcraft-core-busclient');

var cmd = {};
var rc  = {};

/**
 * Retrieve the list of available commands.
 *
 * @returns {Object} The list and definitions of commands.
 */
exports.xcraftCommands = function () {
  var paths = process.env.PATH.split (path.delimiter);
  paths.forEach (function (location) {
    if (!fs.existsSync (location)) {
      return;
    }

    var regex = xPlatform.getOs () === 'win' ? /\.(exe|bat|cmd)$/ : /.*/;

    var bins = xFs.ls (location, regex);
    bins.forEach (function (bin) {
      if (xPlatform.getOs () !== 'win' && !xFs.canExecute (bin)) {
        return;
      }

      rc[bin] = {
        desc: 'execute ' + bin,
        options: {
          scope: 'exec',
          params: {
            optional: 'argv...'
          }
        }
      };

      cmd[bin] = function (argv) {
        console.log (bin + ' : ' + argv);
        busClient.events.send ('$.' + bin + '.finished');
      };
    });
  });

  var destFile = path.join (__dirname, './rc.json');
  xUtils.json2JsonFile (rc, destFile);

  return {
    handlers: cmd,
    rc: destFile
  };
};
