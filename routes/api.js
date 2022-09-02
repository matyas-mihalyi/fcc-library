/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { addBook, findBooks, deleteBooks, findBook, commentOnBook, deleteBook } = require('../handler/bookHandler'); 

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await findBooks();
        res.json(books);
      }
      catch (err) {
        res.status(500);
        res.send(err);
      }
      
    })
    
    .post(async (req, res) => {
      try {
        const title = req.body.title;
        const book = await addBook(title);
        res.status(200);
        res.json(book);
      } 
      catch (err) {
        res.send(err.message);
      }
    })
    
    .delete(async (req, res) => {
      try {
        await deleteBooks();
        res.status(200);
        res.send('complete delete successful');
      }
      catch (err) {
        res.status(200);
        res.send(err.message);
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      try {
        const bookid = req.params.id;
        const book = await findBook(bookid);
        res.json(book);
      }
      catch (err) {
        res.send(err.message);
      }
    })
    
    .post(async (req, res) => {
      try {
        const bookid = req.params.id;
        const comment = req.body.comment;
        const book = await commentOnBook(bookid, comment);
        res.json(book);
      }
      catch (err) {
        res.send(err.message);
      }
    })
    
    .delete(async (req, res) => {
      try {
        const bookid = req.params.id;
        await deleteBook(bookid);
        res.send('delete successful');
      }
      catch (err) {
        res.send(err.message);
      }
      //if successful response will be 'delete successful'
    });
  
};
