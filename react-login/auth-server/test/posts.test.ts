// posts.module.test.js
import supertest from 'supertest';
import * as http from 'http';
import dotenv from 'dotenv';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import app from '../services/app';

dotenv.config();

let server: any;
let testEnv: any;
let db;

let accessToken: string;
export const validUser = {
  email: 'jdoe@email.com',
  password: 'password',
};
const post = {
  desireSkills: 'runnning',
  haveSkills: 'swimming',
  description: 'I am looking for a running partner.',
  categories: ['sports', 'fitness']
}
const post2 = { 
  desireSkills: 'swimming',
  haveSkills: 'running',
  description: 'I am looking for a swimming partner.',
  categories: ['sports', 'fitness']
}

const comment = {
  postID: '12345',
  comment: 'This is a comment on a post'
}


// Set up Firebase test environment and server before all tests
beforeAll(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(resolve));

  testEnv = await initializeTestEnvironment({
      projectId: 'test-project', // replace with your Firebase project ID
      firestore: {
        host: 'localhost',
        port: 8080,
      },
  });

  db = testEnv.unauthenticatedContext().firestore(); // Use this `db` for all Firestore operations in tests
  await testEnv.clearFirestore(); // Clear any data before running tests
});

// Tear down Firebase test environment and server after all tests
afterAll(async () => {
  await testEnv.cleanup();
  server.close();
});

describe('SignUp User For AccessToken', () => {
  test('Signup New User', async () => {
    await supertest(server)
      .post('/api/v0/signup')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'jdoe@email.com',
        password: 'password',
        zip: '12345'
      })
      .expect(201);
  });
  // Valid login test
  test('Good Credentials Accepted', async () => {
    await supertest(server)
      .post('/api/v0/login')
      .send(validUser)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        accessToken = res.body.accessToken; // Store token for further use
      });
  });
});

describe('New Post Endpoint Tests', () => {
  test('Make New Post', async () => {
    await supertest(server)
      .post('/api/v0/createPost')
      .set('Cookie', `accessToken=${accessToken}`)
      .send(post)
      .expect(201)
      .then((res) => {
        expect(res).toBeDefined();
        expect(typeof res.body).toBe('string');
        comment.postID = res.body;
      });
  });

  test('Make New Post Without Token (Unauthorized)', async () => {
    await supertest(server)
      .post('/api/v0/createPost')
      .send(post)
      .expect(401);
  });
  test('Make New Post With Bad Request', async () => {
    await supertest(server)
      .post('/api/v0/createPost')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        desireSkills: 'runnning',
        haveSkills: 'swimming',
        wrong: 'wrong',
        categories: ['sports', 'fitness']
      })
      .expect(400);
  });
  test('Make Another New Post to Add onto Posts Array in DB', async () => {
    await supertest(server)
      .post('/api/v0/createPost')
      .set('Cookie', `accessToken=${accessToken}`)
      .send(post2)
      .expect(201)
      .then((res) => {
        expect(res).toBeDefined();
        expect(typeof res.body).toBe('string');
      });
  });
});

describe('Create Comment Endpoint Tests', () => {
  test('Create Comment on Post', async () => {
    await supertest(server)
      .post('/api/v0/createComment')
      .set('Cookie', `accessToken=${accessToken}`)
      .send(comment)
      .expect(201)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBe(true);
      });
  });
  test('Create Second Comment on Post', async () => {
    await supertest(server)
      .post('/api/v0/createComment')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        postID: comment.postID,
        comment: 'This is a second comment on a post'
      })
      .expect(201)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBe(true);
      });
  });
  test('Unauthorized Comment' , async () => {
    await supertest(server)
      .post('/api/v0/createComment')
      .send(comment)
      .expect(401);
  });
});

describe('Get Local Posts Endpoint Tests', () => {
  // Sending categories to posts doesn't do anything, could even leave it empty
  // Could send with no categories/no .send part
  test ('Get Local Posts', async () => {
    await supertest(server)
      .post('/api/v0/getLocalPosts')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({categories: ['']})
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.length).toBe(2);
      });
  });
  // Somehow need to test for if there is no valid user, but user comes from accessToken
  // So the user should be in the system
});