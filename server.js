var config = require('./config.js');
var Slack = require('slack-client');
var token = config.slackApiKey;
var slack = new Slack(token, true, true);

slack.on('message', function(message) {
    var user = slack.getUserByID(message.user);
 	var channel = slack.getChannelGroupOrDMByID(message.channel);

    if (message.type === 'message' 
    	&& channel.name === 'bottesting') {
        console.log(channel.name + ' ' + user.name + ':' + message.text);
    	channel.send('Hey there');
    }
});
 
slack.login();