const { Author } = require('../models');
const helper = require('./helper');

exports.addAuthor = async (req, res) => {
    helper.addItem(res, req.body, Author);
}

exports.getAllAuthors = async (req, res) => {
    helper.getAllItems(res, Author);
}

exports.getAuthor = async (req, res) => {
    helper.getItem(res, req.params.id, Author);
}

exports.updateAuthor = async (req, res) => {
    helper.updateItem(res, req.params.id, req.body, Author);
}

exports.deleteAuthor = async (req, res) => {
    helper.deleteItem(res, req.params.id, Author);
}