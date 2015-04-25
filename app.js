var server = require('./server.js');
var config = require('./config.js');

server.go();

var ft = require('./bot.js');
ft.go();