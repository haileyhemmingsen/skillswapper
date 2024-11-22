// posts.module.test.js
import supertest from 'supertest';
import * as http from 'http';
import dotenv from 'dotenv';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import app from '../services/app';

dotenv.config();

let server: any;
let postTestEnv: any;
let db;

let accessToken: string;
let accessToken2: string;
let accessToken3: string;
let ID: string;
export const validUser = {
  email: 'jmarsten@email.com',
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
const post3 = {
  desireSkills: 'climbing',
  haveSkills: 'biking',
  description: 'I am looking for a biking partner.',
  categories: ['sports', 'climbing']
}

const comment = {
  postID: '12345',
  comment: 'This is a comment on a post'
}


// Set up Firebase test environment and server before all tests
beforeAll(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(resolve));

  postTestEnv = await initializeTestEnvironment({
      projectId: 'post-test', // Replace with your Firebase project ID
      firestore: {
          host: 'localhost',
          port: 8080,
      },
  });

  db = postTestEnv.unauthenticatedContext().firestore(); // Use this `db` for all Firestore operations in tests
  await postTestEnv.clearFirestore(); // Clear any data before running tests
});

// Tear down Firebase test environment and server after all tests
afterAll(async () => {
  await postTestEnv.cleanup();
  await new Promise((resolve) => server.close(resolve)); // Safely close the server
});

describe('SignUp User For AccessToken', () => {
  test('Signup New User', async () => {
    await supertest(server)
      .post('/api/v0/signup')
      .send({
        firstname: 'John',
        lastname: 'Marsten',
        email: 'jmarsten@email.com',
        password: 'password',
        zip: '34567'
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
        ID = res.body.id;
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
  test('SignUp, Login, and Post with New User', async () => {
    await supertest(server)
        .post('/api/v0/signup')
        .send({
            firstname: '', // No Name on Purpose
            lastname: '', // to test an endpoint further down
            email: 'amorgan@email.com',
            password: 'dutch',
            zip: '23456'
        })
        .expect(201);
      await supertest(server)
        .post('/api/v0/login')
        .send({
          email: 'amorgan@email.com',
          password: 'dutch'
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          accessToken2 = res.body.accessToken; // Store token for further use
        });
      await supertest(server)
        .post('/api/v0/createPost')
        .set('Cookie', `accessToken=${accessToken2}`)
        .send(post3)
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
  test('Bad Request Comment', async () => {
    await supertest(server)
      .post('/api/v0/createComment')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        postID: '2892798379',
        comment: 'wrong'
      })
      .expect(500);
  });
});

describe('Get All Comments Endpoint Tests', () => {
  test('Get All Comments', async () => {
    await supertest(server)
      .get('/api/v0/getAllComments')
      .query({post_id: comment.postID})
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.length).toBe(2); // 2 comments on post
      });
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
        expect(res.body.length).toBe(3); // 3 total posts posted
      });
  });
  // Somehow need to test for if there is no valid user, but user comes from accessToken
  // So the user should be in the system
});

describe('Get User Posts Endpoint Tests', () => {
  test('Get User Posts', async () => {
    await supertest(server)
      .get('/api/v0/getUserPosts')
      .set('Cookie', `accessToken=${accessToken}`)
      .send(ID)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.length).toBe(2); // 2 posts posted by logged in user
      });
  });
  test ('Get User Posts With No First/Last Name', async () => {
    await supertest(server)
      .get('/api/v0/getUserPosts')
      .set('Cookie', `accessToken=${accessToken2}`)
      .send(ID)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.length).toBe(1); // 1 post posted by logged in user
      });
  });
});

describe('EditPost Endpoint Tests', () => {
  test('editPost Works', async () => {
    await supertest(server)
      .post('/api/v0/editPost')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        id: comment.postID,
        skillsAsked: 'biking',
        skillsOffered: 'running',
        description: 'I am looking for a biking partner.',
        categories: ['biking']
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBe(true);
      });
  });
});

describe('ArchiveUpdate Endpoint Tests', () => {
  test('ArchiveUpdate Works', async () => {
    await supertest(server)
      .post('/api/v0/ArchiveUpdate')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        archive: true,
        postID: comment.postID
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBe(true);
      });
  });
  test('ArchiveUpdate Fails', async () => {
    await supertest(server)
      .post('/api/v0/ArchiveUpdate')
      .send({
        archive: true,
        postID: '12345'
      })
      .expect(401);
  });
  test('Archive On Account with No Posts', async () => {
    await supertest(server)
    .post('/api/v0/signup')
    .send({
        firstname: 'Dutch',
        lastname: 'Van Der Linde',
        email: 'dutch@email.com',
        password: 'tahiti',
        zip: '45678'
    })
    .expect(201);
  await supertest(server)
    .post('/api/v0/login')
    .send({
      email: 'dutch@email.com',
      password: 'tahiti'
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      accessToken2 = res.body.accessToken; // Store token for further use
    });
  await supertest(server)
    .post('/api/v0/ArchiveUpdate')
    .set('Cookie', `accessToken=${accessToken2}`)
    .send({
      archive: true,
      postID: '12345'
    })
    .expect(500);
  });
  test('ArchiveUpdate Fails with Bad Request', async () => {
    await supertest(server)
      .post('/api/v0/ArchiveUpdate')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        archive: true,
        postID: 'wrong'
      })
      .expect(500);
  });
});