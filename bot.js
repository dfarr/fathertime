'use strict';

var config = require('./config.js');
var Slack = require('slack-client');
var chrono = require('chrono-node');
var m = require('moment-timezone');
var moment = require('moment');
var token = config.slackApiKey;

if (!token) { 
    console.log('Failed to start. Did you set the environment variable SLACK_API_KEY ?');
    process.exit(1);
}

var slack = new Slack(token, true, true);

module.exports.go = function() {
    slack.on('message', function(message) {
        var user = slack.getUserByID(message.user);
        var channel = slack.getChannelGroupOrDMByID(message.channel);
        var results = chrono.parse(message.text);

        if(results.length > 0 && message.type === 'message' && user.is_bot === false && channel.name === 'bottesting') {
            results.forEach(function(result) {

                var author = slack.getUserByID(message.user);

                var start = m.tz(result.start.date().toISOString(), author.tz);
                var end = result.end ? m.tz(result.end.date().toISOString(), author.tz) : undefined;

                channel.send('converting: ' + start.format(config.dateFormat));

                channel.members.forEach(function (uuid) {
                    var user = slack.getUserByID(uuid);

                    if(user.is_bot === false) {
                        var msg = '(' + user.name + ', ' + user.tz + ') ';
                        var msg = msg + start.clone().tz(user.tz).format(config.dateFormat) + (end ? 'to ' + end.clone().tz(user.tz).format(config.dateFormat) : '');
                        channel.send(msg, user.id);
                    }
                });
            });
        }
    });
    slack.login();
};