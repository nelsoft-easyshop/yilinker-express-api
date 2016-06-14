'use strict';

var asyncWrapper = require('../../base_test').asyncWrapper;
var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('waybill get details test cases', function(){
    var getDetailsPath = '../../../src/controller/waybill/get_details';
    var packageRepoPath = '../../repository/package';
    var resSpy = null;
    var reqMock = null;
    var notFoundCode = 404;
    var foundCode = 200;
    var notFoundResponse = {
        status: 'failed',
        data: null,
        message: 'No Entry Found'
    };
    var foundResponse = {
        status: 'successful',
        data: {
            waybill_number: 'normies',
            status_name: 'REEEEEE',
            status_value: 666
        },
        message: ''
    };

    // empty waybill param
    describe('empty waybill parameter', function(){
        before(function(done){
            asyncWrapper(done, function(){
                reqMock = {params:{waybill:''}};
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };
                proxyquire(
                    getDetailsPath, {
                    [packageRepoPath]: {}
                })(reqMock, resSpy);
                done();
            });
        });

        it('should return empty', function(){
            expect(resSpy.status).to.have.been.calledWith(notFoundCode);
            expect(resSpy.json).to.have.calledWithExactly(notFoundResponse);
        });
    })

    // non-existent / not owned waybill
    describe('non existent waybill', function(){
        before(function(done){
            asyncWrapper(done, function(){
                reqMock = {params:{waybill:'foo'}};
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };
                var packageRepoStub = {
                    getWaybillStatus: sinon.stub().returns(
                        Promise.reject()
                    )
                };

                proxyquire(
                    getDetailsPath, {
                    [packageRepoPath]: packageRepoStub
                })(reqMock, resSpy);
                done();
            });
        });

        it('should return empty', function(){
            expect(resSpy.status).to.have.been.calledWith(notFoundCode);
            expect(resSpy.json).to.have.calledWithExactly(notFoundResponse);
        });
    });

    // valid waybill
    describe('valid waybill', function(){
        before(function(done){
            asyncWrapper(done, function(){
                reqMock = {params:{waybill:'legit'}};
                resSpy = {
                    status: sinon.spy(),
                    json: sinon.spy()
                };
                var packageRepoStub = {
                    getWaybillStatus: sinon.stub().returns(Promise.resolve({
                        waybill_number: foundResponse.data.waybill_number,
                        status_name: foundResponse.data.status_name,
                        status_value: foundResponse.data.status_value
                    }))
                };

                proxyquire(
                    getDetailsPath, {
                    [packageRepoPath]: packageRepoStub
                })(reqMock, resSpy);
                done();
            });
        });

        it('should return details', function(){
            expect(resSpy.status).to.have.been.calledWith(foundCode);
            expect(resSpy.json).to.have.calledWithExactly(foundResponse);
        });
    });
});
