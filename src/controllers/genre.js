const { Genre } = require('../models');
const helper = require('./helper');

exports.addGenre = async (req, res) => {
    helper.addItem(res, req.body, Genre);
}

exports.getAllGenres = async (req, res) => {
    helper.getAllItems(res, Genre);
}

exports.getGenre = async (req, res) => {
    helper.getItem(res, req.params.id, Genre);
}

exports.updateGenre = async (req, res) => {
    helper.updateItem(res, req.params.id, req.body, Genre);
}

exports.deleteGenre = async (req, res) => {
    helper.deleteItem(res, req.params.id, Genre);
}