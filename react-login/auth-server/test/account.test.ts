// account.test.ts
import supertest from 'supertest';
import * as http from 'http';
import dotenv from 'dotenv';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import app from '../services/app';

dotenv.config();

let server: any;
let accountTestEnv: any;
let db;

// Sample users
export const validUser = {
  email: 'jdoe@email.com',
  password: 'newpassword',
};

export const invalidUser = {
  email: 'molly@books.com',
  password: 'incorrectpassword',
};

let accessToken: string;

// Set up Firebase test environment and server before all tests
beforeAll(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(resolve));

  accountTestEnv = await initializeTestEnvironment({
    projectId: 'account-test', // Replace with your Firebase project ID
    firestore: {
      host: 'localhost',
      port: 8080,
    },
  });

  db = accountTestEnv.unauthenticatedContext().firestore(); // Use this `db` for all Firestore operations in tests
  await accountTestEnv.clearFirestore(); // Clear any data before running tests
});

// Tear down Firebase test environment and server after all tests
afterAll(async () => {
  await accountTestEnv.cleanup();
  await new Promise((resolve) => server.close(resolve)); // Safely close the server
});

describe('Account Endpoint Tests', () => {
  // Invalid URL
  test('GET Invalid URL', async () => {
    await supertest(server).get('/api/v0/non-existent-route').expect(404);
  });

  // Valid docs endpoint
  test('GET API Docs', async () => {
    await supertest(server).get('/api/v0/docs/').expect(200);
  });

  // Signup test
  test('Signup New User', async () => {
    await supertest(server)
      .post('/api/v0/signup')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'jdoe@email.com',
        password: 'newpassword',
        zip: '12345',
      })
      .expect(201);
  });
  // Signup failure due to existing account
  test('Signup Failure for Existing Account', async () => {
    await supertest(server)
      .post('/api/v0/signup')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'jdoe@email.com',
        password: 'John123',
        zip: '12345',
      })
      .expect(409);
  });

  // Valid login test
  test('Good Credentials Accepted', async () => {
    await supertest(server)
      .post('/api/v0/login')
      .send(validUser)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.firstName).toEqual('John');
        expect(res.body.lastName).toEqual('Doe');
        expect(res.body.accessToken).toBeDefined();
        accessToken = res.body.accessToken; // Store token for further use
      });
  });

  test('Login with Invalid AccessToken', async () => {
    await supertest(server)
      .post('/api/v0/changePassword')
      .set('Cookie', 'nope')
      .send(validUser)
      .expect(401);
  });

  test('Login With Wrong Password', async () => {
    await supertest(server)
      .post('/api/v0/login')
      .send({ email: 'jdoe@email.com', password: 'wrongpassword' })
      .expect(401);
  });

  // Invalid login credentials
  test('Bad Credentials Rejected on Login', async () => {
    await supertest(server).post('/api/v0/login').send(invalidUser).expect(401);
  });

  // Test JWT with corrupt token
  test('Corrupt JWT Rejected on changePassword', async () => {
    await supertest(server)
      .post('/api/v0/changePassword')
      .set('Authorization', `Bearer ${accessToken}garbage`)
      .expect(401);
  });

  // Accessing a protected route with a valid JWT
  test('Good Access Token Authenticated: changePassword', async () => {
    await supertest(server)
      .post('/api/v0/changePassword')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        email: 'jdoe@email.com',
        oldPass: 'newpassword',
        newPass: 'password',
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBe(true);
      });
    // Check to see it worked
    await supertest(server)
      .post('/api/v0/login')
      .send({
        email: 'jdoe@email.com',
        password: 'password',
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.firstName).toEqual('John');
        expect(res.body.accessToken).toBeDefined();
        accessToken = res.body.accessToken; // Store token for further use
      });
  });

  test('changePassword with Wrong oldPass', async () => {
    await supertest(server)
      .post('/api/v0/changePassword')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        email: 'jdoe@email.com',
        oldPass: 'different',
        newPass: 'newpassword',
      })
      .expect(500);
  });

  test('changePassword with Invalid Email', async () => {
    await supertest(server)
      .post('/api/v0/changePassword')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        email: 'fake@email.com',
        oldPass: 'password',
        newPass: 'newpassword',
      })
      .expect(500);
  });

  // Bad access token rejected
  test('Bad Access Token Rejected', async () => {
    await supertest(server)
      .post('/api/v0/changePassword')
      .set('Cookie', 'accessToken=invalidtoken')
      .expect(401);
  });

  test('changeEmail Works', async () => {
    await supertest(server)
      .post('/api/v0/changeEmail')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        oldEmail: 'jdoe@email.com',
        newEmail: 'new@email.com',
        password: 'password',
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBe(true);
      });
    await supertest(server)
      .post('/api/v0/login')
      .send({
        email: 'new@email.com',
        password: 'password',
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.firstName).toEqual('John');
        expect(res.body.accessToken).toBeDefined();
        accessToken = res.body.accessToken; // Store token for further use
      });
  });

  test('changeEmail with Wrong oldEmail', async () => {
    await supertest(server)
      .post('/api/v0/changeEmail')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        oldEmail: 'fake@email.com',
        newEmail: 'new@email.com',
        password: 'password',
      })
      .expect(500);
  });
  test('Logout Endpoint Works', async () => {
    await supertest(server).post('/api/v0/logout').expect(200);
  });
});
