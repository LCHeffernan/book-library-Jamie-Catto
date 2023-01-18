const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
    before(async () => Genre.sequelize.sync());

    beforeEach(async () => await Genre.destroy({ where: {} }));

    describe('with no records in the databse', () => {
        describe('POST /genres', () => {
            it('creates a new genre in the database', async () => {
                const response = await request(app).post('/genres').send({
                    genre: 'Science Fiction'
                });

                const newGenre = await Genre.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.genre).to.equal('Science Fiction');
                expect(newGenre.genre).to.equal('Science Fiction');
            });

            it('returns a 404 if no genre is entered', async () => {
                const response = await request(app).post('/genres').send({});

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('Genre.genre cannot be null');
            });
        });
    });

    describe('with records in the database', () => {
        let genres;

        beforeEach(async () => {
            genres = await Promise.all([
                Genre.create({ genre: 'Science Fiction' }),
                Genre.create({ genre: 'Adventure' }),
                Genre.create({ genre: 'Horror' })
            ]);
        });

        describe('GET /genres', () => {
            it('returns all genres in the database', async () => {
                const response = await request(app).get('/genres');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((genre) => {
                    const expected = genres.find((b) => b.id === genre.id);

                    expect(genre.genre).to.equal(expected.genre);
                });
            });
        });

        describe('GET /genres/:id', () => {
            it('get a genre record by id', async () => {
                const genre = genres[0]
                const response = await request(app).get(`/genres/${genre.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.genre).to.equal(genre.genre);
            });

            it('returns a 404 if the genre is not in the database', async () => {
                const response = await request(app).get('/genres/9999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('genre 9999999 does not exist.');
            });
        });

        describe('PATCH /genres/:id', () => {
            it('updates a genres name by id', async () => {
                const genre = genres[0];
                const response = await request(app).patch(`/genres/${genre.id}`).send({
                    genre: 'Romance'
                });

                const updatedGenre = await Genre.findByPk(genre.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedGenre.genre).to.equal('Romance');
            });

            it('returns a 404 if the genre is not in the database', async () => {
                const response = await request(app).patch('/genres/9999999').send({
                    name: 'Romance'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('genre 9999999 does not exist.');
            });
        });

        describe('DELETE /genres/:id', () => {
            it('deletes a genre by id', async () => {
                const genre = genres[0];
                const response = await request(app).delete(`/genres/${genre.id}`);

                const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedGenre).to.equal(null);
            })

            it('returns a 404 if the genre is not in the database', async () => {
                const response = await request(app).delete('/genres/9999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('genre 9999999 does not exist.');
            });
        });
    });
});