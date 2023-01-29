module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'You need to enter a book title.'
                },
                notEmpty: {
                    args: [true],
                    msg: 'The book title cannot be left empty.'
                },
            },
        },
        isbn: DataTypes.STRING
    }

    const BookModel = connection.define('Book', schema);

    return BookModel;
}