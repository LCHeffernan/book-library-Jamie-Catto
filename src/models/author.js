module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            notEmpty: true
        }
    }

    const AuthorModel = connection.define('Author', schema);

    return AuthorModel;
}