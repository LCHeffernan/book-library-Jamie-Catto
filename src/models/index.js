const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');
const AuthorModel = require('./author')
const GenreModel = require('./genre');

const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env

const setupDatabase = () => {
    const connection = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
        host: PGHOST,
        port: PGPORT,
        dialect: 'postgres',
        logging: false
    });

    const Reader = ReaderModel(connection, Sequelize);
    const Book = BookModel(connection, Sequelize);
    const Author = AuthorModel(connection, Sequelize);
    const Genre = GenreModel(connection, Sequelize);

    Genre.hasMany(Book);
    Author.hasMany(Book);
    Book.belongsTo(Author);
    Book.belongsTo(Genre);
    Book.belongsToMany(Reader, {through: 'Loans'});
    Reader.belongsToMany(Book, {through: 'Loans'});

    connection.sync({ alter: true });

    return { Reader, Book, Author, Genre };
}

module.exports = setupDatabase();