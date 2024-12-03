// chat.test.ts
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
let ID2: string;

export const validUser = {
  email: 'jmarsten@email.com',
  password: 'password',
};

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
  test('Sign Up User With No Username', async () => {
    await supertest(server)
      .post('/api/v0/signup')
      .send({
        firstname: '',
        lastname: '',
        email: 'missingperson@email.com',
        password: 'yep',
        zip: '12345',
      })
      .expect(201);
  });
  // Valid login test
  test('Log In User', async () => {
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
  test('Login User 2', async () => {
    await supertest(server)
      .post('/api/v0/login')
      .send({
        email: 'missingperson@email.com',
        password: 'yep',
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        accessToken2 = res.body.accessToken; // Store token for further use
        ID2 = res.body.id;
      });
  });
});

// Message Body
// export interface Message {
//   chatID?: string | undefined,
//   message: string,
//   sender: string,
//   receiver: string,
//   timestamp: Date
// }

let chatID: string;
// Two Tests:
// - There is an existing chat
// - There is no existing chat
describe('Chat sendMessage Tests', () => {
  // Invalid URL
  test('Create New Chat', async () => {
    await supertest(server)
      .post('/api/v0/sendMessage')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        message: 'Hello',
        sender: `${ID}`,
        receiver: `${ID2}`,
        timestamp: new Date(),
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(typeof res.body).toBe('string');
        chatID = res.body;
      });
  });
  test('Send Another Message on Existing Chat', async () => {
    await supertest(server)
      .post('/api/v0/sendMessage')
      .set('Cookie', `accessToken=${accessToken2}`)
      .send({
        chatID: chatID,
        message: 'How are you?',
        sender: `${ID2}`, // These should be the IDs of the Sender and Receiver
        receiver: `${ID}`,
        timestamp: new Date(),
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(typeof res.body).toBe('string');
      });
  });
  test('Send New Chat with Wrong ChatID', async () => {
    await supertest(server)
      .post('/api/v0/sendMessage')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        chatID: 'WrongChat',
        message: 'Wrong',
        sender: `${ID}`,
        receiver: `${ID2}`,
        timestamp: new Date(),
      })
      .expect(404);
  });
});

describe('Retrieve Chats Tests', () => {
  test('retrieveChats Retrieves Appropriate Chats', async () => {
    await supertest(server)
      .get('/api/v0/retrieveChats')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(1);
        expect(res.body[0].recent_message).toEqual('How are you?') // Multiple Messages, but only 1 chat between the 2 accounts
      });
  });
  test('Appropriately Marks Chats as Read when Requesting as the Most Recent Sender', async () => {
    await supertest(server)
      .post('/api/v0/sendMessage')
      .set('Cookie', `accessToken=${accessToken2}`)
      .send({
        chatID: chatID,
        message: 'Nope, nevermind.',
        sender: `${ID2}`, // These should be the IDs of the Sender and Receiver
        receiver: `${ID}`,
        timestamp: new Date(),
      })
      .expect(200);
    await supertest(server)
      .get('/api/v0/retrieveChats')
      .set('Cookie', `accessToken=${accessToken2}`)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(1); // Multiple Messages, but only 1 chat between the 2 accounts
      });
  });
  test('No Chats to Pull', async () => {
    await supertest(server)
      .post('/api/v0/login')
      .send({
        email: 'dutch@email.com',
        password: 'tahiti',
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        accessToken3 = res.body.accessToken; // Store token for further use
      });
    await supertest(server)
      .get('/api/v0/retrieveChats')
      .set('Cookie', `accessToken=${accessToken3}`)
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(0); // 0 chats
      });
  });
});

describe('Retrieve Chat History Tests', () => {
  test('Get Chat History', async () => {
    await supertest(server)
      .get('/api/v0/retrieveChatHistory')
      .set('Cookie', `accessToken=${accessToken}`)
      .query({ chat_id: chatID })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.chatID).toEqual(chatID);
        expect(res.body.second_chatter).toBeDefined();
        expect(res.body.second_chatter).toEqual(`${ID2}`);
        expect(res.body.messages).toBeDefined();
      });
  });
  test('Get Chat History NewChat', async () => {
    await supertest(server)
      .get('/api/v0/retrieveChatHistory')
      .set('Cookie', `accessToken=${accessToken}`)
      .query({ chat_id: 'NewChat' })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.chatID).toEqual('NewChat');
        expect(res.body.second_chatter).toEqual('');
        expect(res.body.messages.length).toEqual(0);
      });
  });
  test('Get Chat History Wrong ChatID', async () => {
    await supertest(server)
      .get('/api/v0/retrieveChatHistory')
      .set('Cookie', `accessToken=${accessToken}`)
      .query({ chat_id: 'WrongChat' })
      .expect(500);
  });
  test('Get Chat History From User2', async () => {
    await supertest(server)
      .get('/api/v0/retrieveChatHistory')
      .set('Cookie', `accessToken=${accessToken2}`)
      .query({ chat_id: chatID })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.chatID).toEqual(chatID);
        expect(res.body.second_chatter).toBeDefined();
        expect(res.body.second_chatter).toEqual(`${ID}`);
        expect(res.body.messages).toBeDefined();
      });
  });
});
