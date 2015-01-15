'use strict';
/* Xcraft core bin shell extensions */

var path = require ('path');
var fs   = require ('fs');
var xFs  = require ('xcraft-core-fs');
var xUtils = require ('xcraft-core-utils');

var busClient    = require ('xcraft-core-busclient');
var cmd = {};
var rc = {};

/**
* Retrieve the list of available commands.
*
* @returns {Object} The list and definitions of commands.
*/
exports.xcraftCommands = function () {
  var paths = process.env.PATH.split (path.delimiter);
  paths.forEach (function (location) {
    // TODO: other platforms
    if (!fs.existsSync (location)) {
      return;
    }
    var bins = xFs.ls (location, /\.(exe|bat|cmd)$/);
    bins.forEach (function (bin) {
      rc[bin] = {
        desc: 'execute ' + bin,
        options : {
          scope: 'exec',
          params : {
            optional : 'argv...'
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
