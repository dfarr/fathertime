var config = require('./config.js');
var Slack = require('slack-client');
var token = config.slackApiKey;
var slack = new Slack(token, true, true);

slack.on('message', function(message) {
    var user = slack.getUserByID(message.user);
    var channel = slack.getChannelGroupOrDMByID(message.channel);

    // if (message.type === 'message' 
    //     && channel.name === 'bottesting') {
    //     console.log(channel.name + ' ' + user.name + ':' + message.text);
    //     channel.send('Hey there');
    // }

    var regex = /([0-9]{1,2}):([0-9]{2})(am|pm)?/gi;

    var match = regex.exec(message);

    console.log(match);

    if(match && message.type === 'message' && channel.name === 'bottesting') {

        var time = new Date();

        var hour = parseInt(match[1], 10);
        var mins = parseInt(match[2], 10);

        if(match[3] && match[3].toLowerCase() === 'pm') {
            hour = hour + 12;
        }

        time.setHours(hour);
        time.setMinutes(mins);

        channel.send(time);

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

    }
});
 
slack.login();