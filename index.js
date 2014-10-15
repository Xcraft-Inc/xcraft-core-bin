'use strict';
/* Xcraft core bin shell extensions */

module.exports = function (settings) {
  var app = settings.shell;

  app.cmd('.node', 'launch nodejs', function (req, res, next) {
    res.cyan('todo: launch .node').ln();
    return res.prompt();
  });
};
