'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/fathertime',
  slackApiKey: process.env.SLACK_API_KEY || '',
  dateFormat: 'MMM Do, h:mm a (z)'
};
