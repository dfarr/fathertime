'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	uuid: {
		type: String,
		required: true
	},
	timezone: {
		type: String,
		trim: true,
		default: ''
	}
});

mongoose.model('User', UserSchema);