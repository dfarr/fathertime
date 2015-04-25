var server = require('./server.js');
var config = require('./config.js');
var mongoose = require('mongoose');
var db = mongoose.connect(config.db);
var fs = require('fs');

console.log('Bootstraping models');

var models_path = __dirname + '/app/models'

fs.readdirSync(models_path).forEach(function (file) {
	var filename = models_path + '/' + file;
	console.log('Loading : ' + filename);
  	require(filename);
});

server.go();

var ft = require('./bot.js');
ft.go();