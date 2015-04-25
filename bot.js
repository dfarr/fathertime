'use strict';

var config = require('./config.js');
var Slack = require('slack-client');
var token = config.slackApiKey;
var slack = new Slack(token, true, true);
var chrono = require('chrono-node');
var m = require('moment-timezone');

module.exports.go = function() {
    slack.on('message', function(message) {
        var userName = slack.getUserByID(message.user);
        var channel = slack.getChannelGroupOrDMByID(message.channel);
        var results = chrono.parse(message.text);

        if (results.length > 0 && message.type === 'message' && channel.name === 'bottesting') {
            results.forEach(function(result) {
                var start = m(result.start.date());
                var end = result.end ? m(result.end.date()) : undefined;

                channel.members.forEach(function (uuid) {
                    var user = slack.getUserByID(uuid);
                    if (user.is_bot === false) {
                        channel.send(user.name + ' ' + start.tz(user.tz).format(config.dateFormat), user.id);
                    }
                });
            });
        }
    });
    slack.login();
};