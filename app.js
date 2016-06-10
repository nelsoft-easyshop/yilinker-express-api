'use strict';

/**
 * Dependencies
 */

var express = require('express');
var app = express();

var logger = require('morgan');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var parameters = require('./app/config/parameters');

/**
 * Uncomment if we'll allow AJAX-ing to this app
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 */

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

/**
 * Setup logging according to env
 */

if(app.get('env') != 'production'){
    // just log to console
    app.use(logger('dev'));
}
else{
    // https://www.npmjs.com/package/morgan#log-file-rotation
    // rotate log files in app/logs
    var FileStreamRotator = require('file-stream-rotator');
    var fs = require('fs');
    var logDirectory = __dirname + '/app/logs';
    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: logDirectory + '/access-%DATE%.log',
        frequency: 'daily',
        verbose: false
    });

    // setup the logger (Apache-like)
    app.use(morgan('combined', {stream: accessLogStream}))
}

/**
 * Pre cache DB connection
 */

require('./src/common/db');

/**
 * Middlewares
 */

// We'll only accept JSON for now
app.use(bodyParser.json());    
// app.use(bodyParser.urlencoded({ extended: false }));

// use helmet
// https://www.npmjs.com/package/helmet#top-level-helmet
app.use(helmet());
app.disable('etag')

/**
 * Routes
 */
app.use('/waybill', require('./app/config/routing/waybill'));

/**
 * Error related middlewares
 * If our app reaches this middleware, it's an error
 */

// If app reaches this middleware, it didn't match
// any routes in router, so 404 then propagate to general
// error handler
app.use(function(req, res, next){
    res
        .status(404)
        .json({
            message: 'Invalid Endpoint'
        });
});

// if not production, dump trace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        require('debug')('Express:app.js')(err);
    });
}
else{
    app.use(function(err, req, res, next) {
        res
            .status(err.status || 500)
            .json({
                message: 'Internal Server Error'
            });
    });
}

module.exports = app;
