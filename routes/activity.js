'use strict';
// var  pool = require('../lib/db');

var util = require('util');
var Path = require('path');
var JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var Client = require('pg');
var http = require('https');
var Intercom = require('intercom-client');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.hostname);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );

    // DEBUG
    console.log('in edit step');
    logData(req);
    res.status(200).send('Edit')
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {

    console.log('in save step');
    logData(req);
    res.status(200).send('Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    //
    // TODO handle multiple inputs
    //
    // DEBUG
    console.log('in execute step');
    console.log('test' + process.env.intercomToken);

    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {

            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];

            var client = new Intercom.Client({
                token: process.env.intercomToken
            });

            var userTag = decodedArgs.userTag;
            var email = decodedArgs.emailAddress;
            var firstname = decodedArgs.firstname;

            // Intercom API functions create new user
            var userId = email;

            // Untag function 
            // client.tags.tag({
            //     name: userTag,
            //     users: [{
            //         user_id: userId,
            //         "untag" : true
            //     }]
            // });
            // Check user existence in intercom
            client.users.find({
                user_id: userId
            }, (err, d) => {
                // err is an error response object, or null
                // d is a successful response object, or null
                console.log('error ' + JSON.stringify(err));
                console.log('d ' + JSON.stringify(d));

                if (err !== null) {
                    client.users.create({
                        user_id: userId
                    }, (err, d) => {
                        console.log('error in user create' + err);
                        console.log('d in user create' + JSON.stringify(d));
                        if (err == null) {
                            console.log("user not exist, add tag after create user" + userId);
                            // Add tag
                            client.tags.tag({
                                name: userTag,
                                users: [{
                                    user_id: userId
                                }]
                            });
                            insertIntoDb(user_id, userTag, 'true');
                        }
                    });
                } else {
                    // Add tag
                    console.log("user exist, add tag directly" + userId);
                    client.tags.tag({
                        name: userTag,
                        users: [{
                            user_id: userId
                        }]
                    });
                }
            });

            logData(req);
            res.status(200).send('Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.status(200).send('Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    // Decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }
        res.status(200).send('Validate');
    });
    logData(req);
};


/*
 * POST Handler for /stop/ route of Activity.
 */
exports.stop = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    logData(req);
    res.status(200).send('Stop');
};