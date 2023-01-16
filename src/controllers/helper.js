exports.addItem = async (res, item, Model) => {
    try {
        const newItem = await Model.create(item);
        res.status(201).json(newItem);
    } catch (err) {
        const errMessage = err.errors?.map((e) => e.message);
        res.status(404).json({message: errMessage});
    }
}