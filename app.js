'use strict';

/**
 * Dependencies
 */

var express = require('express');
var app = express();

var winston = require('winston');
var bodyParser = require('body-parser');
var helmet = require('helmet');

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
 * Setup winston
 */
winston.add(require('winston-daily-rotate-file'), {
    timestamp: function() {
        return require('dateformat')(new Date(), "yyyy-mm-dd HH:MM:ss");
    },
    filename:  __dirname + '/app/logs/log',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false
})
.remove(winston.transports.Console)
.on('error', function(err){
    winston.error(err);
});

winston.level = 'error';
winston.exitOnError = false;

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
app.disable('etag');

/**
 * Version 1 Route
 */
app.use(
    '/v1', 
    require('./app/middleware/authentication/client_basic_auth'), 
    require('./app/config/routing/v1')
);


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
            status: 'failed',
            message: 'Invalid Endpoint'
        });
});

// if not production, dump trace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err.stack);
        next(err);
    });
}

app.use(function(err, req, res, next) {
    winston.log('error', "%s", err.stack || err);
    res
        .status(err.status || 500)
        .json({
            status: 'failed',
            message: 'Internal Server Error'
        });
});

module.exports = app;
