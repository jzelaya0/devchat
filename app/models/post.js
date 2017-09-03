"use strict";
// POST MODEL
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// POST SCHEMA
// ==================================================
const PostSchema = new Schema({
	title: String,
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [{
		text: String,
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	}]
}, {
	timestamps: true
});

// Create a post model from Schema
const Post = mongoose.model('Post', PostSchema);
//Export the post model
module.exports = Post;
