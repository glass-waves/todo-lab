require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
    describe('routes', () => {
        let token;

        beforeAll(async done => {
            execSync('npm run setup-db');

            client.connect();

            const signInData = await fakeRequest(app)
                .post('/auth/signup')
                .send({
                    email: 'jon@user.com',
                    password: '1234'
                });

            token = signInData.body.token; // eslint-disable-line

            return done();
        });

        afterAll(done => {
            return client.end(done);
        });

        test('adds a todo to the table', async () => {
            const newTodo = {
                todo: 'clean out the gutters',
                completed: false
            }

            const expectation = [
                {
                    id: 4,
                    todo: 'clean out the gutters',
                    completed: false,
                    user_id: 2
                }
            ];

            const data = await fakeRequest(app)
                .post('/api/todo')
                .send(newTodo)
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });
        
        test('returns all todos', async () => {

            const expectation = [
                {
                    id: 4,
                    todo: 'clean out the gutters',
                    completed: false,
                    user_id: 2
                }
            ];

            const data = await fakeRequest(app)
                .get('/api/todo')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test('returns a todo by id', async () => {

            const expectation = [
                {
                    id: 4,
                    todo: 'clean out the gutters',
                    completed: false,
                    user_id: 2
                }
            ];

            const data = await fakeRequest(app)
                .get('/api/todo/4')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test('returns todos by completed status', async () => {

            const expectation = [
                {
                    id: 4,
                    todo: 'clean out the gutters',
                    completed: false,
                    user_id: 2
                }
            ];

            const data = await fakeRequest(app)
                .get('/api/todo/completed/false')
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test('updates a todo completed property to true from false', async () => {
            const newTodo = {
                completed: true           
            }

            const expectation = [
                {
                    id: 4,
                    todo: 'clean out the gutters',
                    completed: true,
                    user_id: 2
                }
            ];

            const data = await fakeRequest(app)
                .put('/api/todo/4')
                .send(newTodo)
                .set('Authorization', token)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });
    });
});
