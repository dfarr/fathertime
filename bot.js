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

    if (results.length > 0 && message.type === 'message' && user.is_bot === false) {
      results.forEach(function(result) {

        var t = moment();

        var diff = t.utcOffset() - m.tz(t, user.tz).utcOffset();

        var start = new Date(result.start.date().getTime() + (diff * 60000));
        var end = result.end ? new Date(result.end.date().getTime() + (diff * 60000)) : undefined;

        start = m.tz(start.toISOString(), user.tz);
        end = end ? m.tz(end.toISOString(), user.tz) : undefined;

        channel.members.forEach(function(uuid) {
          var user = slack.getUserByID(uuid);

          if (user.is_bot === false) {
            var msg = start.clone().tz(user.tz).format(config.dateFormat) + (end ? ' to ' + end.clone().tz(
              user.tz).format(config.dateFormat) : '');
            msg = message.text.replace(result.text, msg);
            slack.getChannelGroupOrDMByName(user.name).send(msg, user.id);
          }
        });
      });
    }
  });
  slack.login();
};
