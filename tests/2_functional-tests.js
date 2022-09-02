/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const { validBookInput, invalidBookInput, commentWithInvalidId, invalidId } = require('./mocks');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    let validId;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(validBookInput)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');

          assert.property(res.body, '_id', 'Book should contain _id');
          assert.isString(res.body._id, '_id property should be a string');

          assert.property(res.body, 'title', 'Book should contain title');
          assert.isString(res.body.title, 'title property should be a string');
          assert.equal(res.body.title, validBookInput.title, 'title property should match the title in the request');

          validId = { _id: res.body._id };

          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(invalidBookInput)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.equal(res.text, 'missing required field title', 'Error message should be "missing required field title"');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], '_id', 'Book objects should have _id property');

          assert.property(res.body[0], 'title', 'Book objects should have title property');
          assert.isString(res.body[0].title, 'title property should be a string');
          assert.isAtLeast(res.body[0].title.length, 1, 'title property should be at least than 1 characters');

          assert.property(res.body[0], 'commentcount', 'Book objects should have commentcount property');
          assert.isNumber(res.body[0].commentcount, 'commentcount property should be a number');
          assert.isAtLeast(res.body[0].commentcount, 0, 'commentcount property should be at least 0');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get(`/api/books/${invalidId._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.equal(res.text, 'no book exists', 'Error message should be "no book exists"');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${validId._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, '_id', 'Book should contain _id');
          assert.equal(res.body._id, validId._id, 'Book _id should match the requested _id');
          
          assert.property(res.body, 'title', 'Book should contain title');
          assert.isString(res.body.title, 'title property should be a string');
          assert.isAtLeast(res.body.title.length, 1, 'title property should be at least 1 characters');
          
          assert.property(res.body, 'comments', 'Book should contain comments property');
          assert.isArray(res.body.comments, 'comments property should be an array');
          
          done();
        });
      });
      
    });
    
    
    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const comment = {comment: "nice book"}

        chai.request(server)
          .post(`/api/books/${validId._id}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send(comment)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.equal(res.body._id, validId._id, 'Book _id should match the requested _id');
            
            assert.property(res.body, 'title', 'Book should contain title');
            assert.isString(res.body.title, 'title property should be a string');
            assert.isAtLeast(res.body.title.length, 1, 'title property should be at least 1 characters');
            
            assert.property(res.body, 'comments', 'Book should contain comments property');
            assert.isArray(res.body.comments, 'comments property should be an array');
            assert.equal(res.body.comments[0], comment.comment, 'the first comment should be equal to the comment in the request');
            
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${validId._id}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({nocomment: "nice book"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'missing required field comment', 'response should be "missing required field comment"');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/${invalidId._id}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({comment: "nice book"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists', 'response should be "no book exists"');
            done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${validId._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'delete successful', 'response should be "delete successful"');
            done();
          });
        });
        
        test('Test DELETE /api/books/[id] with id not in db', function(done){
          chai.request(server)
          .delete(`/api/books/${invalidId._id}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists', 'response should be "no book exists"');
            done();
      });
      });

    });

  });

});
