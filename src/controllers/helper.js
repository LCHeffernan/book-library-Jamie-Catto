const { Reader, Book } = require('../models');

const getModelAsString = (model) => {
    if (model === Reader) {
        return 'reader';
    }
    if (model === Book) {
        return 'book';
    }
}

exports.addItem = async (res, item, Model) => {
    try {
        const newItem = await Model.create(item);
        res.status(201).json(newItem);
    } catch (err) {
        const errMessage = err.errors?.map((e) => e.message);
        res.status(404).json({message: errMessage});
    }
}

exports.getAllItems = async (res, Model) => {
    const items = await Model.findAll();
    res.status(200).json(items);
}

exports.getItem = async (res, itemId, Model) => {
    const item = await Model.findByPk(itemId);

    if (!item) {
        return res.status(404).json({ message: `${getModelAsString(Model)} ${itemId} does not exist.` });
    }

    res.status(200).json(item);
}

exports.updateItem = async (res, itemId, updateData, Model) => {
    const [ updatedRows ] = await Model.update(updateData, { where: {id: itemId} });
    const updatedItem = await Model.findByPk(itemId);

    if (!updatedItem) {
        return res.status(404).json({ message: `${getModelAsString(Model)} ${itemId} does not exist.` });
    }

    res.status(200).json(updatedItem);
}

exports.deleteItem = async (res, itemId, Model) => {
    const deletedRows = await Model.destroy({ where: {id: itemId} });

    if (!deletedRows) {
        return res.status(404).json({ message: `${getModelAsString(Model)} ${itemId} does not exist.` });
    }

    res.status(204).json(deletedRows);
}