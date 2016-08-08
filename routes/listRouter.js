/**
 * Created by Abdul Rahman on 7/28/2016.
 */
var express = require('express');
var Models = require('../models/server.model');
var router = express.Router();


/* GET users listing. */
var listController = require('../controllers/lists.server.controller')(Models);

router
    .post('/:username/:listname', listController.add)
//    .get('/:username/:listname', listController.getAll)
    .get('/:username', listController.getAll)
//    .get('/:id', listController.get)
    .post('/:id', listController.syncReply);
/*
 router.use('/:userId', function (req, res, next) {
 Models.User.findById(req.params.userId, function (err, user) {
 if (err) {
 console.log('error ' + err);
 res.status(500).send(err);
 }
 else if (user) {
 req.user = user;
 console.log('Got the user ' + user);
 next();
 }
 else {
 console.log('No records found for id ' + req.params.userId);
 res.status(404).send('No records found');
 }
 })
 });
 router
 .get('/:userId', function (req, res, next) {
 res.json(req.user);
 console.log(req.user);
 })
 .put('/:userId', function (req, res, next) {

 req.user.username = req.body.username;
 req.user.datakey = req.body.datakey;
 req.user.status = req.body.status;
 req.user.HEX123 = req.body.HEX123;
 req.user.save(function (err) {
 if (err) {
 res.status(500).send(err);
 }
 else {
 res.json(req.user);
 }
 });
 })
 .patch('/:userId', function (req, res, next) {
 console.log('in patch');
 for (var p in req.body) {
 req.user[p] = req.body[p];
 }
 req.user.save(function (err) {
 if (err) {
 res.status(500).send(err);
 }
 else {
 res.json(req.user);
 }
 }
 );
 })
 .delete('/:userId', function (req, res, next) {
 console.log('in delete');

 req.user.remove(function (err) {
 if (err) {
 res.status(500).send(err);
 }
 else {
 res.status(410).send('removed');
 }
 }
 );
 });
 */
module.exports = router;
