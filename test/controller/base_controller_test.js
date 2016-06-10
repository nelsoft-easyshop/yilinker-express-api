'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('base controller test cases', function(){
    var baseController = require('../../src/controller/base_controller'); 
    var okCode = 200;
    var notFoundCode = 400;
    var resSpy = null;

    describe('general response builder', function(){
        var builder = baseController.response;
        var defaults = {
            status: 'successful',
            data: null,
            message: ''
        };

        var sample = {
            status: 'failed',
            data: 'foo',
            message: 'bar'
        };

        it('should generate predictable defaults', function(){
            resSpy = { status: sinon.spy() };
            var response = builder(resSpy);
            expect(response).to.deep.equal(defaults);
            expect(resSpy.status).to.have.calledWithExactly(okCode);
        });

        it('should generate according to input', function(){
            resSpy = { status: sinon.spy() };
            var response = builder(
                resSpy,
                sample.data,
                sample.status,
                sample.message,
                notFoundCode
            );

            expect(response).to.deep.equal(sample);
            expect(resSpy.status).to.have.calledWithExactly(notFoundCode);
        });
    });
    
    describe('no entry found builder', function(){
        var builder = baseController.noEntryFound;
        var defaults = {
            status: 'failed',
            data: null,
            message: 'No Entry Found'
        };

        it('should have predictable defaults', function(){
            resSpy = { status: sinon.spy() };
            var response = builder(resSpy);
            expect(response).to.deep.equal(defaults);
            expect(resSpy.status).to.have.calledWithExactly(notFoundCode);
        });
    });
});
