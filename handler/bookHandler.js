const { Schema, default: mongoose } = require("mongoose")

const BookSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, required: true, default: 0 },
  comments: { type: Array, required: true, default: [] }
}, {
  versionKey: false
});

const BookModel = mongoose.model("Books", BookSchema, "Books");

const addBook = async ( title = "" ) => {
  try {
    validateTitle(title);
    const book = new BookModel({title});
    await book.save();
    const responseObject = { title: book.title, _id: book._id }
    return responseObject;
  }
  catch (err) {
    throw new Error(err.message, err);
  }
};

const findBooks = async () => {
  try {
    const books = await BookModel.find({}).select('_id title commentcount');
    return books;
  }
  catch (err) {
    throw new Error(err.message, err);
  }
}

const deleteBooks = async () => {
  try {
    // await mongoose.connection.db.dropCollection('Books');
  }
  catch (err) {
    throw new Error('could not delete collection');
  }
}

const findBook = async ( _id = "" ) => {
  try {
    handleEmptyInput(_id, "_id");
    const book = await BookModel.findById(_id).select('_id title comments').catch(err => {if (err) throw new Error('no book exists')});
    if (book == null) throw new Error('no book exists');
    
    return book
  }
  catch (err) {
    throw new Error(err.message);
  }
}

const commentOnBook = async (_id = "", comment = "") => {
  try {
    handleEmptyInput(comment, 'comment');
    handleEmptyInput(_id, '_id');
    const book = await BookModel.findById(_id).select('_id title comments').catch(err => {if (err) throw new Error('no book exists')});
    if (book == null) throw new Error('no book exists');
    book.comments.push(comment);
    await book.save();
    return book
  }
  catch (err) {
    throw new Error(err.message);
  }
}

const deleteBook = async (_id = "") => {
  try {
    handleEmptyInput(_id, '_id');
    const document = await BookModel.findByIdAndRemove(_id).catch(err => {if (err) throw new Error('no book exists')});
    if (document == null) throw new Error('no book exists');
  }
  catch (err) {
    throw new Error(err.message);
  }
}

const validateTitle = (title = "") => {
  if (!title || title.length === 0) {
    throw new Error('missing required field title');
  }
}

const handleEmptyInput = (input = "", field = "") => {
  if (!input || input.length === 0) {
    throw new Error(`missing required field ${field}`);
  }
}


module.exports = { addBook, findBooks, deleteBooks, findBook, commentOnBook, deleteBook}