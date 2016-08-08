/**
 * Created by Abdul Rahman on 7/24/2016.
 */
var User = require('./users.server.model.js');
var ListItem = require('./list_items.server.model');

var Model = {
    User: User,
    ListItem: ListItem
};

module.exports = Model;