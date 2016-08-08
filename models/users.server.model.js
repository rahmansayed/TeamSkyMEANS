/**
 * Created by Abdul Rahman on 7/24/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*var relatedUserSchema = Schema({

 });
 */
var userLists = Schema({
    listname: String,
    relatedusers: [String]
});

var userSchema = Schema({
    username: String,
    datakey: String,
    status: String,
    vcode: String,
    lists: [userLists],
    referrer: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;