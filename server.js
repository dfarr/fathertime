'use strict';

var http = require('http');

module.exports.go = function() {
  http.createServer(function(req, res) {
    res.end('Welcome to fathertime.');
  }).listen(process.env.PORT || 1337);
};
