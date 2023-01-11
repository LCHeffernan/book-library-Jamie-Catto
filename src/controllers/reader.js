const { Reader } = require("../models");

exports.addReader = async (req, res) => {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
};

exports.getAllReaders = async (req, res) => {
    const readers = await Reader.findAll();
    res.status(200).json(readers);
}

exports.getReader = async (req, res) => {
    // code here
}

exports.updateReaderEmail = async (req, res) => {
    // code here
}

exports.deleteReader = async (req, res) => {
    // code here
}