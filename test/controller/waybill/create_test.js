'use strict';

var proxyquire = require('proxyquire');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('waybill creation test cases', function(){
    var waybillQueuePath = '../../common/queue';
    var createModulePath = '../../../src/controller/waybill/create';
    var createModule = require(createModulePath);
    var waybillCreationFormModule = require('../../../src/form//waybill/create_waybill_form');
    var errorCodes = waybillCreationFormModule.errorCodes;
    var clientApiSettingRepoPath = '../../repository/client_api_setting';


    it('should fail on empty params with predictable json return', function(){
        var req = { body: {} };
        var resSpy = {
            json: sinon.spy(),
            status: sinon.spy()
        };
        return createModule(req, resSpy)
            .then(function(data){
                expect(resSpy.json).to.have.been.calledWithExactly({
                    "status": "failed",
                    "data": {
                        "errors": [
                            errorCodes.consignee_address.required,
                            errorCodes.consignee_name.required,
                            errorCodes.consignee_contact_number.required,
                            errorCodes.declared_value.required,
                            errorCodes.is_cod.required,
                            errorCodes.package_description.required
                        ]
                    },
                    "message": "Malformed Request Parameters"
                });
            });
    });

    it('should fail on missing default shipper address', function(){
        var req = { body: {
            "consignee_address": "maginhawa st. QC",
            "consignee_name": "Sherlock Meme",
            "consignee_contact_number": "12345678",
            "is_cod": true,
            "declared_value": 12312.23,
            "package_description": "gundam",
            "amount_to_collect": 1000,
            "webhook_url": "http://127.0.0.1:9999"
        }};

        var resSpy = {
            json: sinon.spy(),
            status: sinon.spy()
        };

        var clientApiSettingRepoStub = {
            getClientAPISettings: sinon.stub().returns(
                Promise.resolve({
                    then: function(resolve){
                        throw new Error(errorCodes.api_address.required);
                    }
                })   
            )
        };

        return proxyquire(
            createModulePath, {
                [clientApiSettingRepoPath]: clientApiSettingRepoStub
            })(req, resSpy)
            .then(function(data){
                expect(resSpy.json).to.have.been.calledWithExactly({
                    "status": "failed",
                    "data": {
                        "errors": [
                            errorCodes.api_address.required
                        ]
                    },
                    "message": "Malformed Request Parameters"
                });
            });
    });
    
    it('should succeed on complete details', function(){
        var settings = {
            default_address_id: 15
        };

        var req = { 
            body: {
                "consignee_address": "maginhawa st. QC",
                "consignee_name": "Sherlock Meme",
                "consignee_contact_number": "12345678",
                "is_cod": true,
                "declared_value": 12312.23,
                "package_description": "gundam",
                "amount_to_collect": 1000,
                "webhook_url": "http://127.0.0.1:9999"
            },
            consumerId: 13
        };

        var resSpy = {
            json: sinon.spy(),
            status: sinon.spy()
        };

        var clientApiSettingRepoStub = {
            getClientAPISettings: sinon.stub().returns(
                Promise.resolve(settings)   
            )
        };

        var waybillQueueStub = {
            waybillQueue: {
                add: sinon.spy()
            }
        };

        return proxyquire(
            createModulePath, {
                [clientApiSettingRepoPath]: clientApiSettingRepoStub,
                [waybillQueuePath]: waybillQueueStub
            })(req, resSpy)
            .then(function(data){
                expect(waybillQueueStub.waybillQueue.add).to.have.been.calledWithExactly({
                    default_address_id: 15,
                    consignee_address: "maginhawa st. QC",
                    consignee_name: "Sherlock Meme",
                    consignee_contact_number: "12345678",
                    is_cod: true,
                    declared_value: 12312.23,
                    package_description: "gundam",
                    amount_to_collect: 1000,
                    webhook_url: "http://127.0.0.1:9999",
                    consumer_id: 13
                });

                expect(resSpy.json).to.have.been.calledWithExactly({
                    status: 'successful',
                    data: null,
                    message: ''
                });
            });
    });
});
