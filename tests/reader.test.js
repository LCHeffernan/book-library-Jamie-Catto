const { Reader } = require('../src/models');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('/readers', () => {
    before(async () => Reader.sequelize.sync());

    beforeEach(async () => await Reader.destroy({ where: {} }))

    describe('with no records in the database', () => {
        describe('POST /readers', () => {
            it('creates a new reader in the database', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    email: 'benny.cumbo@gmail.com'
                });

                expect(response.status).to.equal(201);
            });
        });
    });
});