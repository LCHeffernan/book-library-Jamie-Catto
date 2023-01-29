module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
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
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'You need to enter a book author.'
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