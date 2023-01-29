module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'You need to enter an author name.'
                },
                notEmpty: {
                    args: [true],
                    msg: 'The author name cannot be left empty.'
                },
            },
        }
    }

    const AuthorModel = connection.define('Author', schema);

    return AuthorModel;
}