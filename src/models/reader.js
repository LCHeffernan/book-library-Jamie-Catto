module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'You need to enter a reader name.'
                },
                notEmpty: {
                    args: [true],
                    msg: 'The reader name cannot be left empty.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    args: [true],
                    msg: 'You need to enter a valid email address.'
                },
                notNull: {
                    args: true,
                    msg: 'You need to enter an email address.'
                },
                notEmpty: {
                    args: [true],
                    msg: 'The email address cannot be left empty.'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8,99],
                    msg: 'The password must be over 8 characters.'
                },
                notNull: {
                    args: [true],
                    msg: 'You need to enter a password.'
                },
                notEmpty: {
                    args: [true],
                    msg: 'The password cannot be left empty.'
                }
            }
        }
    };

    const ReaderModel = connection.define('Reader', schema);

    return ReaderModel;
};