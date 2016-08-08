/**
 * Created by Abdul Rahman on 7/24/2016.
 */
var userController = function (Models) {

    var subscribe = function (req, res) {
        console.log(req.body);
        // checking if the user is invited or not
        Models.User.findOne({"username": req.body.userName}, function (err, user) {
                console.log('user = ' + user);
                if (err) {
                    console.log('error ' + err);
                    res.status(500).send('Error ' + err);
                } else if (user) {
                    // user is invited
                    user.datakey = req.body.datakey;
                    user.vcode = Math.random().toString(36).slice(-4).toUpperCase();
                    user.status = 'Inactive';
                    user.save();
                    res.status(201).send(user);
                }
                else {
                    // the user is new
                    var newUser = new Models.User();
                    newUser.username = req.body.userName;
                    newUser.datakey = req.body.datakey;
                    newUser.status = 'Inactive';
                    newUser.lists = [];
//                    newUser.referrer = {};
                    newUser.vcode = Math.random().toString(36).slice(-4).toUpperCase();
                    console.log('User Code = ' + newUser.vcode);
                    console.log(newUser);
                    newUser.save();
                    res.status(201).send(newUser);
                }

            }
        );
    };

    var activate = function (req, res, next) {
        console.log(req.body);
        Models.User.findOne({"username": req.params.username}, function (err, user) {
            if (err) {
                console.log('error ' + err);
                res.status(500).send('Error ' + err);
            }
            else if (user) {
                console.log('user = ' + user);
                console.log('user.vcode = ' + user.vcode);
                console.log('req.body.vcode = ' + req.body.vcode);

                if (user.vcode === req.body.vcode) {
                    console.log('req.body.vcode = ' + req.body.vcode);
                    console.log('user.vcode = ' + user.vcode);
                    user.status = 'Active';
                    //adding default list to the user Grocery
                    user.lists = {listname: 'Grocery', relatedusers: []};
                    user.save();
                    res.status(200).send('Activation Successfull');
                } else {
                    res.status(401).send('Incorrect Verification Code.\n Please try again');
                }
            } else {
                res.status(401).send('User not found\nPlease register.')
            }

        });
    };

    var invite = function (req, res) {
        console.log(req.body);
        var newUser = new Models.User();
        var userExists = true;
        // checking if the invited user is already subscribed/invite
        Models.User.findOne({"username": req.body.userName}, function (err, user) {
            if (err) {
                console.log('error ' + err);
                res.status(500).send('Error ' + err);
            } else if (user) {
                console.log('user already exists');
                newUser = new Models.User(user);
                console.log("newUser " + newUser);
            }
            else {
                //   newUser = new Models.User();
                userExists = false;
                console.log('building new record');
                newUser.username = req.body.userName;
                newUser.datakey = '';
                newUser.status = 'Invite';
                newUser.lists = [];
                newUser.vcode = '';
                console.log("newUser " + newUser);
            };
            console.log('before call');

            Models.User.findOneAndUpdate(
                {"username": req.params.username, "lists.listname": req.params.listname},
                {$push: {"lists.$.relatedusers": newUser.username}},
                {
                    projection: {"lists.$": 1}
                },
                function (err, user) {
                    console.log('user ' + user);
                    console.log('req.params.username ' + req.params.username);
                    console.log('req.params.listname ' + req.params.listname);
                    if (err) {
                        console.log('error ' + err);
                    }
                    else if (user) {
                        console.log('user = ' + user);
                        // creating the invited user
                        if (!userExists) {
                            newUser.referrer = user.username;
                            newUser.save();
                        }
                        //adding the new user to the list
//                    user.lists.$.relatedusers.push(newUser._id);
                        console.log('after adding related user');
                        console.log('user = ' + user);
//                    user.lists[0].markModified("relatedusers");
//                    user.lists[0].save();
                        user.markModified("lists[0].relatedusers");
                        user.save();
                        res.status(200).send('Invitation Successfull');
                    }
                    else {
                        res.status(404).send('Invitee does not exist');

                    }
                });
        });
    };

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
        subscribe: subscribe,
        get: get,
        activate: activate,
        invite: invite
    }
};

module.exports = userController;