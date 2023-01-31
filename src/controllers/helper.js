const { Reader, Book, Author, Genre } = require('../models');

const removePassword = (object) => {
    if(object.hasOwnProperty('password')) {
        delete object.password;
    }
    return object;
}

const getModelAsString = (model) => {
    if (model === Reader) {
        return 'reader';
    }
    if (model === Book) {
        return 'book';
    }
    if (model === Author) {
        return 'author';
    }
    if (model === Genre) {
        return 'genre';
    }
}

const getOptions = (model) => {
    if (model === Book) {
        return { include:  [Author, Genre] };
    } else if (model === Genre || model === Reader || model === Author) {
        return { include: Book };
    }

    return {};
}

exports.addItem = async (res, item, Model) => {
    try {
        const newItem = await Model.create(item);
        const itemWithoutPassword = removePassword(newItem.dataValues);
        res.status(201).json(itemWithoutPassword);
    } catch (err) {
        const errMessage = err.errors?.map((e) => e.message);
        res.status(404).json({message: errMessage});
    }
}

exports.getAllItems = async (res, Model) => {
    const options = getOptions(Model);
    const items = await Model.findAll(options);
    const itemsWithoutPassword = items.map((item) => removePassword(item.dataValues));
    res.status(200).json(itemsWithoutPassword);
}

exports.getItem = async (res, itemId, Model) => {
    const options = getOptions(Model);
    const item = await Model.findByPk(itemId, options);

    if (!item) {
        return res.status(404).json({ message: `${getModelAsString(Model)} ${itemId} does not exist.` });
    }

    const itemWithoutPassword = removePassword(item.dataValues);
    res.status(200).json(item);
}

exports.updateItem = async (res, itemId, updateData, Model) => {
    const [ updatedRows ] = await Model.update(updateData, { where: {id: itemId} });
    const updatedItem = await Model.findByPk(itemId);

    if (!updatedItem) {
        return res.status(404).json({ message: `${getModelAsString(Model)} ${itemId} does not exist.` });
    }

    const itemWithoutPassword = removePassword(updatedItem.dataValues);
    res.status(200).json(updatedItem);
}

exports.deleteItem = async (res, itemId, Model) => {
    const deletedItem = await Model.findByPk(itemId)
    const deletedRows = await Model.destroy({ where: {id: itemId} });
    if (!deletedRows) {
        return res.status(404).json({ message: `${getModelAsString(Model)} ${itemId} does not exist.` });
    }

    const deletedItemWithoutPassword = removePassword(deletedItem.dataValues);
    res.status(204).json(deletedItemWithoutPassword);
}