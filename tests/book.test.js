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
                    isbn: '9650'
                });

                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });
                expect(response.status).to.equal(201);
                expect(response.body.title).to.equal('The Count of Monte Cristo');
                expect(newBookRecord.title).to.equal('The Count of Monte Cristo');
                expect(newBookRecord.author).to.equal('Alexander Dumas');
                expect(newBookRecord.genre).to.equal('adventure');
                expect(newBookRecord.isbn).to.equal('9650');
            });
        });
    });

    describe('with records in the database', () => {
        let books;

        beforeEach(async () => {
            books = await Promise.all([
                Book.create({ 
                    title: 'The Count of Monte Cristo', 
                    author: 'Alexander Dumas', 
                    genre: 'adventure',
                    isbn: '9650' }),
                Book.create({ 
                    title: 'Treasure Island', 
                    author: 'Robert L Stevenson', 
                    genre: 'adventure',
                    isbn: '1391' }),
                Book.create({ 
                    title: 'It', 
                    author: 'Stephen King', 
                    genre: 'thriller',
                    isbn: '1453' })
            ]);
        });

        describe('GET /books', () => {
            it('gets all books in the database', async () => {
                const response = await request(app).get('/books');

                expect(response.status).to.equal(200);
                console.log(response.body);
                expect(response.body.length).to.equal(3);

                response.body.forEach((book) => {
                    const expected = books.find((a) => a.id === book.id);

                    expect(book.title).to.equal(expected.title);
                    expect(book.author).to.equal(expected.author);
                    expect(book.genre).to.equal(expected.genre);
                    expect(book.isbn).to.equal(expected.isbn);
                });
            });
        });
        describe('GET /books/:id', () => {
            it('gets a book record by id', async () => {
                const book = books[0];
                const response = await request(app).get(`/books/${book.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal(book.title);
                expect(response.body.author).to.equal(book.author);
                expect(response.body.genre).to.equal(book.genre);
                expect(response.body.isbn).to.equal(book.isbn);
            });

            it('returns a 404 if the book is not in the database', async () => {
                const response = await request(app).get('/books/9999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('Book 9999999 does not exist.');
            });
        });

        describe('PATCH /books/:id', () => {
            it('updates title by id', async () => {
                const book = books[0]
                const response = await request(app).patch(`/books/${book.id}`)
                .send({ title: 'Le Comte de Monte Cristo' });

                const updatedBook = await Book.findByPk(book.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedBook.author).to.equal(book.author);
                expect(updatedBook.title).to.equal('Le Comte de Monte Cristo');
            });

            it('returns a 404 if the book is not in the database', async () => {
                const response = await request(app).patch(`/books/9999999`)
                .send({ title: 'Le Comte de Monte Cristo' });

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('Book 9999999 does not exist.');
            });
        });

        describe('DELETE /books/:id', () => {
            it('deletes a book by id', async () => {
                const book = books[0]
                const response = await request(app).delete(`/books/${book.id}`);

                const deletedBook = await Book.findByPk(book.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedBook).to.equal(null);
            });

            it('returns a 404 error if the book is not in the database', async () =>{
                const response = await request(app).delete('/books/9999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('Book 9999999 does not exist.');
            });
        });
    });
});