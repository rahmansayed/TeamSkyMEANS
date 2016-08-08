/**
 * Created by Abdul Rahman on 7/24/2016.
 */
var Promise = require('bluebird');

var listController = function (Models) {

        var syncItem = function (itemId, userId) {
            //TODO add the logic here
            // should send the server id to the client for future referencing
            console.log('userId = ' + userId);
            console.log('itemId = ' + itemId);
        };

        var add = function (req, res) {
            console.log(req.body);
            // checking if the user is invited or not
            var newListItem = new Models.ListItem();
            newListItem.username = req.params.username;
            newListItem.listname = req.params.listname;
            newListItem.item = req.body.item;
            newListItem.uom = req.body.uom;
            newListItem.qty = req.body.qty;
            newListItem.actions = [{action: "ADD", date: Date.now()}];
            newListItem.localIds = [{username: req.params.username, id: req.body.id}];
            newListItem.save();

            Models.User.findOne({
                    "username": req.params.username,
                    "lists.listname": req.params.listname
                }, /*{"lists.$": 1},*/ function (err, userd) {
                    console.log('user = ' + userd);
                    if (err) {
                        console.log('error ' + err);
                        res.status(500).send('Error ' + err);
                    } else if (userd) {
                        console.log('user = ' + userd);
                        console.log('user._id = ' + userd.username);
                        console.log('user.lists = ' + userd.lists);
                        userd.lists[0].relatedusers.forEach(function (relateduser) {
                            syncItem(newListItem._id, relateduser);
                        });
                        res.status(201).send('Sync Successfull');
                    }
                    else {
                        res.status(404).send('Cannot find User');
                    }

                }
            );
        };


        var syncReply = function (req, res, next) {
            console.log(req.body);
            Models.ListItem.findByIdAndUpdate(req.params.id,
                {
                    $push: {
                        "localIds": {
                            "username": req.body.username,
                            "id": req.body.id
                        }
                    }
                },
                function (err, item) {
                    if (err) {
                        console.log('error ' + err);
                        res.status(500).send('Error ' + err);
                    }
                    else if (item) {
                        console.log('item = ' + item);

                        res.status(200).send('Server Sync Successfull');
                    } else {
                        res.status(401).send('Id not found');
                    }
                }
            );
        };

        var getAll = function (req, res) {
                console.log(req.body);

                // getting all the lists that myUser is participating in
                var promise = Models.User.find({"lists.relatedusers": req.params.username}).exec();

                var pArray = [];
                var myListItems = [];

                promise.then(function (users) {
                    if (users) {
                        console.log('user = ' + users);
                        // as the returned cursor return all users that the user relates to, not just the lists he
                        // is participating into, we need to check all the returned lists
                        users.forEach(function (user) {
                            user.lists.forEach(function (list) {
                                //checking that the user is related to that list
                                if (list.relatedusers.indexOf(req.params.username) !== -1) {
                                    console.log("username : " + user.username);
                                    console.log("listname: " + list.listname);
                                    console.log("list.indexOf(req.params.username) = " + list.relatedusers.indexOf(req.params.username));
                                    // getting the unsync items belonging to the list
                                    pArray.push(Models.ListItem.find({
                                            "username": user.username,
                                            "listname": list.listname,
                                            "localIds": {
                                                $not: {$elemMatch: {"username": req.params.username}}
                                            }
                                        },
                                        {"_id": 1, "item": 1, "uom": 1, "qty": 1, "listname": 1, "username": 1}
                                    ).exec());
                                }
                            });
                        });
                        return pArray;
                    }
                    else {
                        throw (new Error("User does not exists " + err));
                    }
                }).then(function () {
                    return Promise.all(pArray);
                }).then(function (listitems) {
                        console.log("listitems " + listitems);
                        if (listitems) {
                            //console.log("username : " + user.username);
                            //console.log("listname: " + list.listname);
                            console.log('listitems = ' + listitems);
                            listitems.forEach(function (listitem) {
                                    if (listitem && listitem != '') {
                                        console.log('adding item to list');
                                        myListItems.push(listitem);
                                    }
                                }
                            );
                        }
                        //return myListItems;
                        console.log("myListItems = " + myListItems);
                        res.json(myListItems);
                    }
                )
                    .catch(function (err) {
                        console.log("Error = " + err);
                        res.status(500).send('Error ' + err);
                    });
            }
            ;


        /*Models.User.find({"lists": {$elemMatch: {"relatedusers": user._id}}}, {
         "username": 1,
         "lists.$": 1
         }, function (err, lists) {
         console.log("list = " + list);
         });
         */
//res.status(201).send("OK");


        var get = function (req, res, next) {
            Models.User.find(req.query, function (err, users) {
                if (err) {
                    console.log('error ' + err);
                }
                else {
                    res.json(users);
                }
            });
        };

        return {
            add: add,
            get: get,
            getAll: getAll,
            syncReply: syncReply
        }
    }
    ;

module.exports = listController;