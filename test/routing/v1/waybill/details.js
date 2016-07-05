'use strict';

var request = require("supertest-as-promised");
var params = require('../../../../app/config/parameters.json');
var app = require('../../../../app');
var chai = require('chai');
var expect = chai.expect;

describe('get waybill details integration test cases', function(){
    it('should fail on invalid credentials', function(){
        return request(app)
            .get('/v1/waybill/details/foo')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Basic foobar')
            .send({})
            .expect(401)
            .expect('Content-Type', /json/)
            .then(function(res){
                expect(res.body.message).to.equal('Invalid Authorization Code');
            });
    });

    it('should 404 on missing waybill', function(){
        return request(app)
            .get('/v1/waybill/details/')
            .set('Content-Type', 'application/json')
            .set('Authorization', params.test.basic_auth)
            .send({})
            .expect(404)
            .expect('Content-Type', /json/)
            .then(function(res){
                expect(res.body.message).to.equal('Invalid Endpoint');
            });
    });

    it('should 404 on invalid waybill', function(){
        return request(app)
            .get('/v1/waybill/details/foobar')
            .set('Content-Type', 'application/json')
            .set('Authorization', params.test.basic_auth)
            .send({})
            .expect(404)
            .expect('Content-Type', /json/)
            .then(function(res){
                expect(res.body.message).to.equal('No Entry Found');
            });
    });

    it('should succeed on valid waybill', function(){
        return request(app)
            .get('/v1/waybill/details/' + params.test.valid_waybill)
            .set('Content-Type', 'application/json')
            .set('Authorization', params.test.basic_auth)
            .send({})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function(res){
                expect(res.body.status).to.equal('successful');
            });
    });
});
