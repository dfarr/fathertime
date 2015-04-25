'use strict';

var config = require('./config.js');
var Slack = require('slack-client');
var token = config.slackApiKey;
var slack = new Slack(token, true, true);
var chrono = require('chrono-node');
var m = require('moment');
var tz = require('moment-timezone');
var mongoose = require('mongoose')
var User = mongoose.model('User');

module.exports.go = function() {
    slack.on('message', function(message) {
        var user = slack.getUserByID(message.user);
        var channel = slack.getChannelGroupOrDMByID(message.channel);
        var results = chrono.parse(message.text);

        if (channel.getType() === 'DM') { 
            channel.send('I heard you');

            User.findOne({uuid: message.user}, function(err, user) {
                 if (err) {
                     return;
                 }
                 if (!user) {
                    (new User({
                        uuid: message.user
                    })).save(function(err) {
                        if (err) {
                            // oh shit;
                        }
                    });
                    return;
                 } 

                 if (user && !user.timezone) {
                     channel.send ('Please tell me what time zone you are currently in.');
                 }
            });
        } else if (results.length > 0 && message.type === 'message' && channel.name === 'bottesting') {
            results.forEach(function(result) {
                var start = m(result.start.date());
                channel.send(start.format(config.dateFormat));
                console.log(start.format(config.dateFormat));

                if (result.end) {
                    var end = m(result.end.date());
                    channel.send(end.format(config.dateFormat));
                    console.log(end.format(config.dateFormat));
                }
            });
        }
    });

    //     channel.users.forEach(function (user) {
            
    //         User.findOne({uuid: user.id}, function(err, user) {

    //             if(!err && user.timezone) {
    //                 channel.sendDM(time, user.id);
    //             }

    //         });

    //     });

    // });

    slack.login();
};