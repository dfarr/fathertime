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

    if (hasDigit(message)) {
      return digit(channel, user);
    }

    if (msgHasTimeStrings(results) && isValidMessage(message) && isHuman(user)) {
      results.forEach(function(result) {
        var msg = buildReplyMsg(channel, result, user);
        console.log(msg);
        channel.send(msg);
      });
    }
  });
  slack.login();
};

function buildReplyMsg(channel, result, user) {
  var timeZones = getUniqueTz(channel);
  var start = getBeginDate(result, user);
  var end = getEndDate(result, user);
  var msg = user.name + ': \'' + result.text + '\'\n';

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
  return msg;
}

function getBeginDate(result, user) {
  var start = new Date(result.start.date().getTime() + getTimeDiff(user));
  return m.tz(start.toISOString(), user.tz);
}

function getEndDate(result, user) {
  var end = result.end ? new Date(result.end.date().getTime() + getTimeDiff(user)) : undefined;
  return end ? m.tz(end.toISOString(), user.tz) : undefined;
}

function getTimeDiff(user) {
  var t = moment();
  return (t.utcOffset() - m.tz(t, user.tz).utcOffset()) * 60000;
}

function getUniqueTz(channel) {
  var timeZones = {};
  channel.members.forEach(function(uuid) {
    var user = slack.getUserByID(uuid);
    if (isHuman(user)) {
      if (!timeZones[user.tz]) {
        timeZones[user.tz] = [];
      }
      timeZones[user.tz].push(user);
    }
  });
  return timeZones;
}

function hasDigit(message) {
  return message.text && message.text.indexOf('dig it') > -1;
}

function digit(channel, user) {
  channel.send('I can dig it, ' + user.name);
}

function msgHasTimeStrings(results) {
  return results.length > 0;
}

function isValidMessage(message) {
  return message.type === 'message';
}

function isHuman(user) {
  return user.is_bot === false;
}
