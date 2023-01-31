const { Book } = require('../models');
const helper = require('./helper');

exports.addBook = async (req, res) => {
    helper.addItem(res, req.body, Book);
}

exports.getAllBooks = async (req, res) => {
    helper.getAllItems(res, Book);
}

exports.getBook = async (req, res) => {
    helper.getItem(res, req.params.id, Book);
}

exports.updateBookTitle = async (req, res) => {
    helper.updateItem(res, req.params.id, req.body, Book);
}

exports.deleteBook = async (req, res) => {
    helper.deleteItem(res, req.params.id, Book);
}