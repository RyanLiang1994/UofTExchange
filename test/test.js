/* Unittest using mocha */
/* Source: http://mochajs.org/#getting-started */
var assert = require('chai').assert;
var req = require('request');
var expect = require('expect.js');
var server = require('../server');
var url = 'http://127.0.0.1:3000/';

describe('Testing request', function() {
    before(function() {
        console.log("success")
    });
    describe('Testing different request', function() {

        it('should have status 200 for request / ', function(done) {
            req(url, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done()
            })
        });

        it('should have status 200 for request /index.html', function(done) {
            req(url+"index.html", function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            })
        });

        it('should have status 403 if not admin but request /admin.html', function(done) {

            req(url+"admin", function(err, res, body) {
                expect(res.statusCode).to.equal(403);
                done()
            })
        });

        it('should have status 400 if an empty signup form has been submited', function(done) {

            req.post(url+"signup", function(err, res, body) {
                expect(res.statusCode).to.equal(400);
                done()
            })
        });

        it('should have status 400 if an empty signin form has been submited', function(done) {
            req.post(url+"signin", function(err, res, body) {
                expect(res.statusCode).to.equal(400);
                done()
            })
        });
    });
});

describe('Testing request', function() {

    describe('Testing right signin input', function() {
        it('should redirect if password is correct', function(done) {
            req.post(url+"signin", {form: {mail: "handsome@ryan.com", password: "ryanleung123", dob: "1111-01-01"}}, function(err, res, body){
                expect(res.statusCode).to.equal(302);
                done();
            })
        });
    });

    describe('Testing wrong signin input', function() {
        it('should return status 400 if password is correct', function(done) {
            req.post(url+"signin", {form: {mail: "handsome@ryan.com", password: "aaa", dob: "1111-01-01"}}, function(err, res, body){
                expect(res.statusCode).to.equal(400);
                done();
            })
        });

    });

    describe('Testing empty feedback input', function() {
        it('should be redirect if password is correct', function(done) {
            req.post(url+"feedback", function(err, res, body){
                expect(res.statusCode).to.equal(302);
                done();
            })
        });
    });
});
