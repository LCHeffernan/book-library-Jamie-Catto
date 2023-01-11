const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
    before(async () => Book.sequelize.sync());

    beforeEach(async () => {
        await Book.destroy({ where: {} });
    });

    describe('with no records in the database', () => {
        describe('POST /books', () => {
            it('creates a new book in the database', async () => {
                const response = await request(app).post('/books').send({
                    title: 'The Count of Monte Cristo',
                    author: 'Alexander Dumas',
                    genre: 'adventure',
                    isbn: '978'
                });

                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });
                expect(response.status).to.equal(201);
                expect(response.body.title).to.equal('The Count of Monte Cristo');
                expect(newBookRecord.title).to.equal('The Count of Monte Cristo');
                expect(newBookRecord.author).to.equal('Alexander Dumas');
                expect(newBookRecord.genre).to.equal('adventure');
                expect(newBookRecord.isbn).to.equal('978');
            });
        });
    });
});