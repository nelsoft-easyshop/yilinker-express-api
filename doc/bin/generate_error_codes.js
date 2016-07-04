#!/usr/bin/env node
'use strict';

console.log('Generating error code table...');

var fs = require('fs');
var util = require('util');
var errorCodes = require('../../src/form/waybill/create_waybill_form').errorCodes;
var lookup = {
    'required': "%s is missing",
    'maxLength': "%s is above max chars",
    'string': "%s is not a string",
    'boolean': "%s is not a valid boolean",
    'number': "%s is not a number",
    'url': "%s is not valid url"
}

// build html templates
var tableTemplate = `
<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        %s
    </tbody>
</table>`;

var row = `<tr>
            <td>%s</td>
            <td>%s</td>
        </tr>`;

var body = '';

var capitalize = function(word){
    return word
        .toLowerCase()
        .split('_')
        .map(i => i[0].toUpperCase() + i.substring(1))
        .join(' ');
}

for(var key in errorCodes){
    for(var prop in errorCodes[key]){
        if(typeof errorCodes[key][prop] === 'object'){
            for(var subProp in errorCodes[key][prop]){
                body += util.format(
                    row, 
                    errorCodes[key][prop][subProp],
                    util.format(lookup[subProp], capitalize(prop))
                );
            }
        }
        else{
            body += util.format(
                row, 
                errorCodes[key][prop],
                util.format(lookup[prop], capitalize(key))
            );
        }
    }
}
var table = util.format(tableTemplate, body);

fs.readFile(__dirname + '/../../../yilinker-express-api-doc/api_project.js', 'utf8', function(err, data){
    if(err) throw err;
    data = data.replace('{{error_codes_table}}', table.replace(/\r?\n|\r/g, ""));
    fs.writeFile(
        __dirname + '/../../../yilinker-express-api-doc/api_project.js', 
        data, 
        function(err){ if (err) throw err;}
    );
});

console.log('Done...');