const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
      await Reader.destroy({ where: {} });
  })

    describe('with no records in the database', () => {
        describe('POST /readers', () => {
            it('creates a new reader in the database', async () => {
                const response = await request(app).post('/readers').send({
                name: 'Benedict Cumberbatch',
                email: 'benny.cumbo@gmail.com',
                password: 'password'
                });

                const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });
                expect(response.status).to.equal(201);
                expect(newReaderRecord.name).to.equal('Benedict Cumberbatch');
                expect(response.body.name).to.equal('Benedict Cumberbatch');
                expect(response.body.email).to.equal('benny.cumbo@gmail.com');
                expect(response.body.password).to.equal(undefined);
            });

            it('returns a 404 if the name field is null', async () => {
                const response = await request(app).post('/readers').send({
                    email: 'benny.cumbo@gmail.com',
                    password: 'password'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('You need to enter a reader name.');
            });

            it('returns a 404 if the name field is empty', async () => {
                const response = await request(app).post('/readers').send({
                    name: '',
                    email: 'benny.cumbo@gmail.com',
                    password: 'password'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('The reader name cannot be left empty.');
            });

            it('returns a 404 if the password is less than 8 characters', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    email: 'benny.cumbo@gmail.com',
                    password: 'assword'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('The password must be over 8 characters.');
            });

            it('returns a 404 if the password is null', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    email: 'benny.cumbo@gmail.com',
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('You need to enter a password.');
            });

            it('returns a 404 if the password is empty', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    email: 'benny.cumbo@gmail.com',
                    password: ''
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[1]).to.equal('The password cannot be left empty.');
            });

            it('returns a 404 if the email is not in email format', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    email: 'bennydotcumboAtgmaildotcom',
                    password: 'password'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('You need to enter a valid email address.');
            });

            it('returns a 404 if the email is null', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    password: 'password'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[0]).to.equal('You need to enter an email address.');
            });

            it('returns a 404 if the email is empty', async () => {
                const response = await request(app).post('/readers').send({
                    name: 'Benedict Cumberbatch',
                    email: '',
                    password: 'password'
                });

                expect(response.status).to.equal(404);
                expect(response.body.message[1]).to.equal('The email address cannot be left empty.');
            });

            it('returns multiple messages for more than one error', async () => {
                const response = await request(app).post('/readers').send({
                    name: '',
                    email: 'benny.cumboatgmail.com',
                    password: 'passwor'
                    });

                expect(response.status).to.equal(404);
                expect(response.body.message.length).to.equal(3);
            })
        });
    });

    describe('with records in the database', () => {
        let readers;

        beforeEach(async () => {
            readers = await Promise.all([
                Reader.create({ name: 'Benedict Cumberbatch', email: 'benny.cumbo@gmail.com', password: 'password' }),
                Reader.create({ name: 'Matt Warburton', email: 'warby@hotmail.com', password: 'password' }),
                Reader.create({ name: 'Yaya Toure', email: 'yaya@kolo.com', password: 'password' })
            ]);
        });

        describe('GET /readers', () => {
            it('gets all reader records', async () => {
                const response = await request(app).get('/readers');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((reader) => {
                    const expected = readers.find((a) => a.id === reader.id);

                    expect(reader.name).to.equal(expected.name);
                    expect(reader.email).to.equal(expected.email);
                    expect(reader.password).to.equal(undefined);
                });
            });
        });
        
        describe('GET /readers/:id', () => {
            it('gets a reader record by id', async () => {
                const reader = readers[0];
                const response = await request(app).get(`/readers/${reader.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.name).to.equal(reader.name);
                expect(response.body.email).to.equal(reader.email);
                expect(response.body.password).to.equal(undefined);
            });

            it('returns a 404 if the reader does not exist', async () => {
                const response = await request(app).get('/readers/9999999'); 
                
                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal("reader 9999999 does not exist.");
            });
        });
        
        describe('PATCH /readers/:id', () => {
            it('updates reader email by id', async () => {
                const reader = readers[0];
                const response = await request(app).patch(`/readers/${reader.id}`)
                .send({ email: 'smitty@mclovin.com' });
                const updatedReaderRecord = await Reader.findByPk(reader.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedReaderRecord.email).to.equal('smitty@mclovin.com');
                expect(response.body.password).to.equal(undefined);
            });

            it('returns a 404 if the reader does not exist', async () => {
                const response = await request(app).patch('/readers/999999')
                .send({ email: 'smitty@mclovin.com' });

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('reader 999999 does not exist.');
            });
        });

        describe('DELETE /readers/:id', () => {
            it('deletes reader record by id', async () =>{
                const reader = readers[0];
                const response = await request(app).delete(`/readers/${reader.id}`);

                const deletedReader = await Reader.findByPk(reader.id, { raw: true });
                expect(response.status).to.equal(204);
                expect(response.body.password).to.equal(undefined);
                expect(deletedReader).to.equal(null);
            });

            it('returns a 404 if the reader does not exist', async () => {
                const response = await request(app).delete('/readers/999999');

                expect(response.status).to.equal(404);
                expect(response.body.message).to.equal('reader 999999 does not exist.');
            });
        });
    });
});