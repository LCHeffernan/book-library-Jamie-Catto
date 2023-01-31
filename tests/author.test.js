const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
    before(async () => Author.sequelize.sync());

    beforeEach(async () => await Author.destroy({ where: {} }));

    describe('with no records in the databse', () => {
        describe('POST /authors', () => {
            it('creates a new author in the database', async () => {
                const response = await request(app).post('/authors').send({
                    name: 'Alexander Dumas'
                });

                const newAuthor = await Author.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Alexander Dumas');
                expect(newAuthor.name).to.equal('Alexander Dumas');
            });

            it('returns a 404 if author name is null', async () => {
                const response = await request(app).post('/authors').send({});

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('You need to enter an author name.');
            });

            it('returns a 404 if author name is empty', async () => {
                const response = await request(app).post('/authors').send({
                    name: ''
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('The author name cannot be left empty.');
            });
        });
    });

    describe('with records in the database', () => {
        let authors;

        beforeEach(async () => {
            authors = await Promise.all([
                Author.create({ name: 'Alexander Dumas' }),
                Author.create({ name: 'Rober L Stevenson' }),
                Author.create({ name: 'Stephen King' })
            ]);
        });

        describe('GET /authors', () => {
            it('returns all authors in the database', async () => {
                const response = await request(app).get('/authors');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((author) => {
                    const expected = authors.find((b) => b.id === author.id);

                    expect(author.name).to.equal(expected.name);
                });
            });
        });

        describe('GET /authors/:id', () => {
            it('get an author record by id', async () => {
                const author = authors[0]
                const response = await request(app).get(`/authors/${author.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.name).to.equal(author.name);
            });

            it('returns a 404 if the author is not in the database', async () => {
                const response = await request(app).get('/authors/9999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('author 9999999 does not exist.');
            });
        });

        describe('PATCH /authors/:id', () => {
            it('updates an author name by id', async () => {
                const author = authors[0];
                const response = await request(app).patch(`/authors/${author.id}`).send({
                    name: 'Some french guy'
                });

                const updatedAuthor = await Author.findByPk(author.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedAuthor.name).to.equal('Some french guy');
            });

            it('returns a 404 if the author is not in the database', async () => {
                const response = await request(app).patch('/authors/9999999').send({
                    name: 'Some french guy'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('author 9999999 does not exist.');
            });
        });

        describe('DELETE /authors/:id', () => {
            it('deletes an author by id', async () => {
                const author = authors[0];
                const response = await request(app).delete(`/authors/${author.id}`);

                const deletedAuthor = await Author.findByPk(author.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedAuthor).to.equal(null);
            })

            it('returns a 404 if the author is not in the database', async () => {
                const response = await request(app).delete('/authors/9999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('author 9999999 does not exist.');
            });
        });
    });
});