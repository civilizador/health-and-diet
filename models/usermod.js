var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar : String,
    email: String,
    name: String,
    lastname: String,
    purchasedIDs: Array ,
    completedIDs: String,
    isAdmin: Boolean
});
//  adds additional methods from passportLocalMongoose to our User Schema.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);