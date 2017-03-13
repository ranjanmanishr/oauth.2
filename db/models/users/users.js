// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var logger = require('../../../logger/logger.js');
// Define our user schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },


    clients: {
        type: [{
            "clientid": { type: String },

            "clientsecret": { type: String }
        }]
    }

});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    logger.info("Entering::" + "UserSchema.pre");
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
    logger.info("Leaving::" + "UserSchema.pre");
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);