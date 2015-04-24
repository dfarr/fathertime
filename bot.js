'use strict';

var config = require('./config.js');
var Slack = require('slack-client');
var token = config.slackApiKey;
var slack = new Slack(token, true, true);
var chrono = require('chrono-node');
var m = require('moment');
var tz = require('moment-timezone');

module.exports.go = function() {
    slack.on('message', function(message) {
        var user = slack.getUserByID(message.user);
        var channel = slack.getChannelGroupOrDMByID(message.channel);
        var results = chrono.parse(message.text);

        if (results.length > 0 && message.type === 'message' && channel.name === 'bottesting') {
            results.forEach(function(result) {
                var start = m(result.start.date());
                channel.send(start.format('MMMM Do YYYY, h:mm a ZZ'));
                console.log(start.format('MMMM Do YYYY, h:mm a ZZ'));

                if (result.end) {
                    var end = m(result.end.date());
                    channel.send(end.format('MMMM Do YYYY, h:mm a ZZ'));
                    console.log(end.format('MMMM Do YYYY, h:mm a ZZ'));
                }
            });
        }

        // var regex = /([0-9]{1,2}):([0-9]{2})(am|pm)?/gi;
        // var match = regex.exec(message);
        // if (match && message.type === 'message' && channel.name === 'bottesting') {

            // var time = new Date();

            // var hour = parseInt(match[1], 10);
            // var mins = parseInt(match[2], 10);

            // if (match[3] && match[3].toLowerCase() === 'pm') {
            //     hour = hour + 12;
            // }

            // time.setHours(hour);
            // time.setMinutes(mins);

            // channel.send(time);

            // User.findOne({uuid: message.user}, function(err, user) {

            //     if(err) {
            //         return;
            //     }

            //     if(!user.timezone) {
            //         // ask user for timezone
            //         return;
            //     }

            //     channel.users.forEach(function (user) {
                    
            //         User.findOne({uuid: user.id}, function(err, user) {

            //             if(!err && user.timezone) {
            //                 channel.sendDM(time, user.id);
            //             }

            //         });

            //     });

            // });

        // }
    });
     
    slack.login();
};