const Sequelize = require('sequelize');

const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env

const setupDatabase = () => {
    const connection = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
        host: PGHOST,
        port: PGPORT,
        dialect: 'postgres',
        logging: false
    });

    connection.sync({ alter: true });

    return {};
}

module.exports = setupDatabase();