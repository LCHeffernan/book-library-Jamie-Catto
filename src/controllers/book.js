const { Book } = require('../models');

exports.addBook = async (req, res) => {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
}

exports.getAllBooks = async (req, res) => {
    const books = await Book.findAll();
    res.status(200).json(books);
}

exports.getBook = async (req, res) => {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);

    if (!book) {
        return res.status(404).json({ message: `Book ${bookId} does not exist.` })
    }
    res.status(200).json(book);
}

exports.updateBookTitle = async (req, res) => {
    const bookId = req.params.id;
    const updateData = req.body;

    const [ updatedRows ] = await Book.update(updateData, { where: {id: bookId} });
    const updatedBook = await Book.findByPk(bookId);

    if (!updatedBook) {
        return res.status(404).json({ message: `Book ${bookId} does not exist.` });
    }
    res.status(200).json(updatedBook);
}

exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;
    
    const deletedRows = await Book.destroy({ where: {id: bookId} });
    if (!deletedRows) {
        return res.status(404).json({ message: `Book ${bookId} does not exist.` });
    }
    res.status(204).json(deletedRows);
}