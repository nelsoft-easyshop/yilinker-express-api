'use strict';

var asyncWrapper = require('../base_test').asyncWrapper;
var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('client access middleware test cases', function(){
    var accessClientPath = '../../app/middleware/client_access';
    var clientRepoPath = '../../src/repository/client';
    var basicAuth = 'basic-auth';
    var reqMock = {};
    var nextSpy = null;
    var resSpy = null;
    var testClientId = 15;
    var testConsumerId = 13;
    var notAuthorizedCode = 401;
    var authErrorJson = {
        status: 'failed',
        data: null,
        message: 'Invalid Authorization Code'
    };

    describe('invalid authorization header', function(){
        before(function(done){
            asyncWrapper(done, function(){
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: {},
                    [basicAuth]: sinon.stub().returns(undefined)
                })(null, resSpy);
                done();
            });
        });

        it('should not auth', function(){
            expect(resSpy.status).to.have.been.calledWith(notAuthorizedCode);
            expect(resSpy.json).to.have.calledWithExactly(authErrorJson);
        });
    });

    describe('invalid credentials', function(){
        before(function(done){
            asyncWrapper(done, function(){
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                var clientRepoStub = {
                    findOneByCredentials: sinon.stub().returns(
                        Promise.reject()
                    )
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: clientRepoStub,
                    [basicAuth]: sinon.stub().returns({name: 'foo', pass: 'bar'})
                })(null, resSpy);
                done();
            });
        });

        it('should not auth', function(){
            expect(resSpy.status).to.have.been.calledWith(notAuthorizedCode);
            expect(resSpy.json).to.have.calledWithExactly(authErrorJson);
        });
    });

    describe('correct credentials', function(){
        before(function(done){
            asyncWrapper(done, function(){
                nextSpy = sinon.spy();
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                var clientRepoStub = {
                    findOneByCredentials: sinon.stub().returns(Promise.resolve({
                        clientId: testClientId,
                        consumerId: testConsumerId
                    }))
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: clientRepoStub,
                    [basicAuth]: sinon.stub().returns({name: 'foo', pass: 'bar'})
                })(reqMock, resSpy, nextSpy);
                done();
            });
        });

        it('should be authenticated', function(){
            expect(nextSpy).have.been.calledOnce;
            expect(reqMock.clientId).to.equal(testClientId);
            expect(reqMock.consumerId).to.equal(testConsumerId);
        });
    });
});
