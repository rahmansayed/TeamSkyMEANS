/**
 * Created by Abdul Rahman on 7/24/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actionsSchema = Schema({
    action: String,
    date: {type: Date, default: Date.now}
}, {
    strict: true
});

var localDetailsSchema = Schema({
    username: String,
    id: Number
});

var listItemSchema = Schema({
    username: String,
    listname: String,
    item: String,
    uom: String,
    qty: Number,
    actions: [actionsSchema],
    localIds: [localDetailsSchema]
});

var ListItem = mongoose.model('ListItem', listItemSchema);

module.exports = ListItem;
