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
    var reqStub = require('express').request;
    var resSpy = null;
    var notAuthorizedCode = 401;
    var testClientId = 15;
    var testConsumerId = 13;
    var nextSpy = null;
    var authErrorJson = {
        status: 'failed',
        data: null,
        message: 'Invalid Authorization Code'
    };

    describe('no authorization header', function(){
        before(function(done){
            asyncWrapper(done, function(){
                sinon.stub(reqStub, 'get').withArgs('Authorization').returns(undefined);
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: {}
                })(reqStub, resSpy);
                done();
            });
        });

        it('should not auth', function(){
            expect(resSpy.status).to.have.been.calledWith(notAuthorizedCode);
            expect(resSpy.json).to.have.calledWithExactly(authErrorJson);
        });

        after(function(){
           reqStub.get.restore(); 
        });
    });


    describe('empty authorization header', function(){
        before(function(done){
            asyncWrapper(done, function(){
                sinon.stub(reqStub, 'get').withArgs('Authorization').returns('');
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: {}
                })(reqStub, resSpy);
                done();
            });
        });

        it('should not auth', function(){
            expect(resSpy.status).to.have.been.calledWith(notAuthorizedCode);
            expect(resSpy.json).to.have.calledWithExactly(authErrorJson);
        });

        after(function(){
           reqStub.get.restore(); 
        });
    });

    describe('invalid authorization header content', function(){
        before(function(done){
            asyncWrapper(done, function(){
                sinon.stub(reqStub, 'get').withArgs('Authorization').returns('foo');
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                var clientRepoStub = {
                    findOneByClientKey: sinon.stub().returns(
                        Promise.reject()
                    )
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: clientRepoStub
                })(reqStub, resSpy);
                done();
            });
        });

        it('should not be authorized', function(){
            expect(resSpy.status).to.have.been.calledWith(notAuthorizedCode);
            expect(resSpy.json).to.have.calledWithExactly(authErrorJson);
        });

        after(function(){
           reqStub.get.restore(); 
        });
    });  
    
    describe('valid authorization header', function(){
        before(function(done){
            asyncWrapper(done, function(){
                nextSpy = sinon.spy();
                sinon.stub(reqStub, 'get').withArgs('Authorization').returns('legit');
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };

                var clientRepoStub = {
                    findOneByClientKey: sinon.stub().returns(Promise.resolve({
                        clientId: testClientId,
                        consumerId: testConsumerId
                    }))
                };

                proxyquire(accessClientPath, {
                    [clientRepoPath]: clientRepoStub
                })(reqStub, resSpy, nextSpy);
                done();
            });
        });

        it('should be authenticated', function(){
            expect(nextSpy).have.been.calledOnce;
            expect(reqStub.clientId).to.equal(testClientId);
            expect(reqStub.consumerId).to.equal(testConsumerId);
        });

        after(function(){
           reqStub.get.restore(); 
        });
    });
});
