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
    const readerId = req.params.id;
    const reader = await Reader.findByPk(readerId);

    if (!reader) {
        res.status(404).json({ message: `Reader ${readerId} does not exist.` });
    } else {
        res.status(200).json(reader);
    }
}

exports.updateReaderEmail = async (req, res) => {
    const readerId = req.params.id;
    const updateData = req.body;

    const [ updatedRows ] = await Reader.update(updateData, { where: { id: readerId } });
    const updatedReader = await Reader.findByPk(readerId);
    
    if(!updatedReader) {
        res.status(404).json({ message: `Reader ${readerId} does not exist.` })
    } else {
        res.status(200).json(updatedReader);
    }
}

exports.deleteReader = async (req, res) => {
    const readerId = req.params.id;
    const deletedRows = await Reader.destroy({ where: {id: readerId} });
    if (!deletedRows) {
        res.status(404).json({ message: `Reader ${readerId} does not exist.` })
    } else {
        res.status(204).json(deletedRows);
    }
}