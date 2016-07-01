#!/usr/bin/env node
/**
 * Auto updates parameters.json whenever a new field is 
 * inserted in the parameters.dist.json file.
 *
 * This is limited to 1 level nest e.g.
 *
 * {
 *     "data": {
 *         "level": "one",
 *         "such": "wow"
 *     },
 *     "same": "level"
 * }
 *
 * and is not built to handle:
 *
 * {
 *     "data": {
 *         "stop": {
 *             "what": "are you doing"
 *         },
 *         "no": {
 *             "stop": "staaahp"
 *         }
 *     }
 * }
 *
 * Updates to this script are welcome.
 */
var fs      = require('fs');
var util    = require('util');
var prompt  = require('readline-sync');
var dist    = require('../app/config/parameters.dist.json');
var diff    = require('deep-diff').observableDiff;
var paramPath = __dirname + '/../app/config/parameters.json';

if(!fs.existsSync(paramPath)){
    saved = fs.writeFileSync(paramPath, '{}', 'utf8');
}

var param = require('../app/config/parameters.json');
diff(param, dist, function(d){
    if (d.kind !== 'N') return;
    if(typeof d.rhs === 'object'){
        param[d.path[0]] = {};
        Object.keys(d.rhs).forEach(function(elem){
            var ans = prompt.question(util.format('%s[%s]: ', [d.path, elem].join('.'), d.rhs[elem]));
            param[d.path[0]][elem] = ans !== '' ? ans : d.rhs[elem];
        });
    }
    else{
        var ans = prompt.question(util.format('%s[%s]: ', d.path.join('.'), d.rhs));
        param[d.path[0]] = ans !== '' ? ans : d.rhs;
    }    
});

fs.writeFile(
    __dirname + '/../app/config/parameters.json', 
    JSON.stringify(param, null, 4), 
    function(err){ if (err) throw err;}
);
