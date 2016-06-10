// standard format is roughly derived from
// http://labs.omniti.com/labs/jsend

// Do 200 if everything goes according to plan
module.exports.response = function(res, data, status, message, code){
    res.status(code || 200);
    return {
        status: (status || 'successful'),
        data: (data || null),
        message: (message || '')
    };
};

// Do 400 if none found
module.exports.noEntryFound = function(res){
    return module.exports.response(
        res,
        null,
        'failed',
        'No Entry Found',
        400
    );
};
