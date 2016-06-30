'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('waybill create form test cases', function(){
    var formModule = require('../../../src/form/waybill/create_waybill_form');
    var form = formModule.form;
    var errorCodes = formModule.errorCodes;

    var doesContainHelper = function(data, value){
        var errArray = data.map(function(list){ return list.message; });
        return expect(errArray).to.contain(value);
    };

    describe('consignee address test cases', function(){
        it('should fail on missing address', function(){
            return form
                .run({})
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_address.required);
                });
        });

        it('should fail on more than 300 char address', function(){
            return form
                .run({
                    consignee_address: 'a'.repeat(301)
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_address.maxLength);
                });
        });

        it('should fail on a non char address', function(){
            return form
                .run({
                    consignee_address: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_address.string);
                });
        });

        it('should succeed on a valid address', function(){
            return form
                .run({
                    consignee_address: 'Numazu, Japan'
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('consignee_address');
                });
        });
    });

    describe('consignee name test cases', function(){
        it('should fail on missing consignee name', function(){
            return form
                .run({})
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_name.required);
                });
        });

        it('should fail on above max char', function(){
            return form
                .run({
                    consignee_name: 'a'.repeat(151)
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_name.maxLength);
                });
        });

        it('should fail on a non char', function(){
            return form
                .run({
                    consignee_name: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_name.string);
                });
        });

        it('should succeed on a valid name', function(){
            return form
                .run({
                    consignee_name: 'Hanzo Hattori'
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('consignee_name');
                });
        });
    });

    describe('consignee contact number test cases', function(){
        it('should fail on missing consignee contact number', function(){
            return form
                .run({})
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_contact_number.required);
                });
        });

        it('should fail on above max char', function(){
            return form
                .run({
                    consignee_contact_number: 'a'.repeat(151)
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_contact_number.maxLength);
                });
        });

        it('should fail on a non char', function(){
            return form
                .run({
                    consignee_contact_number: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.consignee_contact_number.string);
                });
        });

        it('should succeed on a valid contact', function(){
            return form
                .run({
                    consignee_contact_number: '0900000000'
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('consignee_contact_number');
                });
        });
    });

    describe('declared value test cases', function(){
        it('should fail on missing declared value', function(){
            return form
                .run({})
                .catch(function(data){
                    doesContainHelper(data, errorCodes.declared_value.required);
                });
        });

        it('should fail on a non number', function(){
            return form
                .run({
                    declared_value: '123123'
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.declared_value.number);
                });
        });

        it('should fail on too many whole digits', function(){
            return form
                .run({
                    declared_value: 123456789101
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.declared_value.maxLength);
                });
        });

        it('should fail on too many decimal digits', function(){
            return form
                .run({
                    declared_value: 12345678.112
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.declared_value.maxLength);
                });
        });

        it('should succeed on a valid declared value', function(){
            return form
                .run({
                    declared_value: 12345678922.12
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('declared_value');
                });
        });
    });

    describe('is cod test cases', function(){
        it('should fail on missing is cod flag', function(){
            return form
                .run({})
                .catch(function(data){
                    doesContainHelper(data, errorCodes.is_cod.required);
                });
        });

        it('should fail on a non bool', function(){
            return form
                .run({
                    is_cod: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.is_cod.boolean);
                });
        });

        it('should succeed on a valid is cod flag', function(){
            return form
                .run({
                    is_cod: false
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('is_cod');
                });
        });
    });

    describe('package description test cases', function(){
        it('should fail on missing package description', function(){
            return form
                .run({})
                .catch(function(data){
                    doesContainHelper(data, errorCodes.package_description.required);
                });
        });

        it('should fail on above max char', function(){
            return form
                .run({
                    package_description: 'a'.repeat(501)
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.package_description.maxLength);
                });
        });

        it('should fail on a non char', function(){
            return form
                .run({
                    package_description: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.package_description.string);
                });
        });

        it('should succeed on a valid package description', function(){
            return form
                .run({
                    package_description: 'I am the captain of my fate'
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('package_description');
                });
        });
    });

    describe('webhook url test cases', function(){
        it('should not fail on missing key', function(){
            return form
                .run({})
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('webhook_url');
                });
        });

        it('should fail on empty webhook url', function(){
            return form
                .run({
                    webhook_url: ''
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.webhook_url.required);
                });
        });

        it('should fail on above max char', function(){
            return form
                .run({
                    webhook_url: 'a'.repeat(301)
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.webhook_url.maxLength);
                });
        });

        it('should fail on a non char', function(){
            return form
                .run({
                    webhook_url: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.webhook_url.string);
                });
        });

        it('should fail on an invalid webhook url', function(){
            return form
                .run({
                    webhook_url: 'not a url obviously'
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.webhook_url.url);
                });
        });

        it('should succeed on a valid webhook url', function(){
            return form
                .run({
                    webhook_url: 'https://google.com/hook'
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('webhook_url');
                });
        });
    });

    describe('reference number test cases', function(){
        it('should fail on above max char', function(){
            return form
                .run({
                    reference_number: 'a'.repeat(51)
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.reference_number.maxLength);
                });
        });

        it('should fail on a non char', function(){
            return form
                .run({
                    reference_number: 123
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.reference_number.string);
                });
        });

        it('should succeed on a valid reference number', function(){
            return form
                .run({
                    reference_number: 'Nein Nein Nein Nein Nein'
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('reference_number');
                });
        });
    });

    describe('amount to collect test cases', function(){
        it('should fail on missing amount to collect', function(){
            return form
                .run({
                    is_cod: true
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.amount_to_collect.required);
                });
        });

        it('should fail on a non number', function(){
            return form
                .run({
                    is_cod: true,
                    amount_to_collect: '123123'
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.amount_to_collect.number);
                });
        });

        it('should fail on too many whole digits', function(){
            return form
                .run({
                    is_cod: true,
                    amount_to_collect: 123456789101
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.amount_to_collect.maxLength);
                });
        });

        it('should fail on too many decimal digits', function(){
            return form
                .run({
                    is_cod: true,
                    amount_to_collect: 12345678.112
                })
                .catch(function(data){
                    doesContainHelper(data, errorCodes.amount_to_collect.maxLength);
                });
        });

        it('should succeed on a valid amount to collect', function(){
            return form
                .run({
                    is_cod: true,
                    amount_to_collect: 12345678922.12
                })
                .catch(function(data){
                    expect(data.errors).to.not.contain.keys('amount_to_collect');
                });
        });
    });
});
