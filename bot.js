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

    if (message.text.indexOf('dig it') > -1) {
      channel.send('I can dig it, ' + user.name);
      return;
    }

    if (results.length > 0 && message.type === 'message' && user.is_bot === false) {
      results.forEach(function(result) {

        var t = moment();

        var diff = t.utcOffset() - m.tz(t, user.tz).utcOffset();

        var start = new Date(result.start.date().getTime() + (diff * 60000));
        var end = result.end ? new Date(result.end.date().getTime() + (diff * 60000)) : undefined;

        start = m.tz(start.toISOString(), user.tz);
        end = end ? m.tz(end.toISOString(), user.tz) : undefined;

        var timeZones = {};

        channel.members.forEach(function(uuid) {
          var user = slack.getUserByID(uuid);
          if (user.is_bot === false) {
            if (!timeZones[user.tz]) {
              timeZones[user.tz] = [];
            }
            timeZones[user.tz].push(user);
          }
        });

        var msg = user.name + ': ' + message.text + '\n';
        for (var z in timeZones) {
          msg += start.clone().tz(z).format(config.dateFormat) + (end ? ' to ' + end.clone().tz(z).format(
            config.dateFormat) : ' ');
          msg += '(';
          timeZones[z].forEach(function(user, i) {
            msg += user.name;
            msg += timeZones[z].length - 1 === i ? '' : ', ';
          });
          msg += ')' + '\n';
        }
        console.log(msg);
        channel.send(msg);
      });
    }
  });
  slack.login();
};
