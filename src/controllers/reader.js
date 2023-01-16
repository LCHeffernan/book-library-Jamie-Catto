const { Reader } = require("../models");
const helper = require('./helper');

exports.addReader = async (req, res) => {
    helper.addItem(res, req.body, Reader);
};

exports.getAllReaders = async (req, res) => {
    helper.getAllItems(res, Reader);
}

exports.getReader = async (req, res) => {
    helper.getItem(res, req.params.id, Reader);
}

exports.updateReaderEmail = async (req, res) => {
    helper.updateItem(res, req.params.id, req.body, Reader)
}

exports.deleteReader = async (req, res) => {
    helper.deleteItem(res, req.params.id, Reader);
}