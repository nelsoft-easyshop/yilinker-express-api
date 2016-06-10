/**
 * Wrapper for async unit under test
 * @param  {Function}   done    Mocha 'done' callback
 * @param  {Function}   test    Test related code
 * @return {Function}
 */
module.exports.asyncWrapper = function(done, test){
    return setTimeout(test, 10);
};
