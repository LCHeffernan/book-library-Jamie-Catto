const { Book } = require('../models');

exports.addBook = async (req, res) => {
    console.log('Running this code');
    const newBook = await Book.create(req.body);
    console.log('Running THIS code');
    res.status(201).json(newBook);
}