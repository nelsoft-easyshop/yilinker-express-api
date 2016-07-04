'use strict';

var request = require("supertest-as-promised");
var params = require('../../../../app/config/parameters.json');
var app = require('../../../../app');
var chai = require('chai');
var expect = chai.expect;

describe('waybill creation route integration test cases', function(){
    var data = {
        "consignee_address": {
            "complete_address":"Quiapo Metro Manila",
            "province":"Man",
            "city":"Man",
            "barangay":"Qui",
            "street_address": "ola ola ola"
        },
        "consignee_name": "LA Roberto",
        "consignee_contact_number": "12345678",
        "is_cod": true,
        "declared_value": 12312.23,
        "package_description": "gundam",
        "amount_to_collect": 1000,
        "callback_url": "http://127.0.0.1:9999"
    };

    it('should fail on missing auth headers', function(){
        return request(app)
            .post('/v1/waybill/create')
            .set('Content-Type', 'application/json')
            .send({})
            .expect(401)
            .expect('Content-Type', /json/)
            .then(function(res){
                expect(res.body.message).to.equal('Invalid Authorization Code');
            });
    });

    it('should fail on invalid credentials', function(){
        return request(app)
            .post('/v1/waybill/create')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Basic foobar')
            .send({})
            .expect(401)
            .expect('Content-Type', /json/)
            .then(function(res){
                expect(res.body.message).to.equal('Invalid Authorization Code');
            });
    });

    describe('form submission test cases', function(){
        it('should fail on an empty object', function(){
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send({})
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing consignee address', function(){
            var copy = Object.assign({}, data);
            delete copy.consignee_address;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing consignee name', function(){
            var copy = Object.assign({}, data);
            delete copy.consignee_name;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing consignee contact number', function(){
            var copy = Object.assign({}, data);
            delete copy.consignee_contact_number;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing is cod flag', function(){
            var copy = Object.assign({}, data);
            delete copy.is_cod;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing declared value', function(){
            var copy = Object.assign({}, data);
            delete copy.declared_value;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing package description', function(){
            var copy = Object.assign({}, data);
            delete copy.package_description;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should fail on missing amount to collect if cod', function(){
            var copy = Object.assign({}, data);
            delete copy.amount_to_collect;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.message).to.equal('Malformed Request Parameters');
                });
        });

        it('should allow no amount to collect if not is_cod', function(){
            var copy = Object.assign({}, data);
            copy.is_cod = false;
            delete copy.amount_to_collect;
            return request(app)
                .post('/v1/waybill/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', params.test.basic_auth)
                .send(copy)
                .expect(200)
                .expect('Content-Type', /json/)
                .then(function(res){
                    expect(res.body.status).to.equal('successful');
                });
        });
    });
});
