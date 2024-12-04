import {
  Chat_Front,
  Message,
  Chat,
  Returning_Message,
} from './chat.module.index';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  addDoc,
  where,
  query,
  or,
  orderBy,
} from 'firebase/firestore';
import { get } from 'http';

/*
send messages,
upon message sent, 

frontend continually query for new messages when clicked into a specific chat window

upon loading all of the different chats, chats will be ordered by new messages 
(as in the chat has messages unseen by this user), newest message (time sent)
ideally mark the chats in frontend somehow to show that they have unread messages
*/

export class ChatService {
  public async sendMessage(
    message: Message,
    user_id: string
  ): Promise<string | undefined> {
    // we are sending a message here
    if (message.chatID !== undefined) {
      // then chat already exists
      // console.log(message.chatID);
      const chat_ref = doc(db, 'chats', message.chatID);
      const chat_snapshot = await getDoc(chat_ref);
      if (chat_snapshot.exists()) {
        const message_uuid = uuidv4();
        await setDoc(doc(chat_ref, 'messages', message_uuid), {
          id: message_uuid,
          senderID: user_id,
          message: message.message,
          timestamp: message.timestamp,
        });
        return message.chatID;
      }
    } else {
      // need to create a new chat
      const chat_uuid = uuidv4();

      await setDoc(doc(db, 'chats', chat_uuid), {
        chat_id: chat_uuid,
        user_1: user_id,
        user_2: message.receiver,
        read: false,
      });
      const chat_ref = doc(db, 'chats', chat_uuid);

      // create new collection
      const message_ref = collection(chat_ref, 'messages');
      const message_uuid = uuidv4();
      await setDoc(doc(message_ref, message_uuid), {
        id: message_uuid,
        senderID: user_id,
        message: message.message,
        timestamp: message.timestamp,
      });
      return chat_uuid;

      // upon creating new chat, need to add sender ID to chat doc, receiver ID to chat doc,
      // the messages collection, and then add the message to the messages collection
    }
    return undefined;
  }

  // this function SOLELY RETURNS ALL OF THE CHATS, MARKING THEM AS READ OR NOT, THEIR ID, AND THE MOST RECENT MESSAGE. THIS GOES NO DEEPER. IT WILL ORDER THEM CORRECTLY
  public async retrieveChats(
    receiver_id: string
  ): Promise<Chat_Front[] | undefined> {
    let fronts = new Array<Chat_Front>();
    const chat_collection_ref = collection(db, 'chats');

    async function getUsernameByUUID(uuid: string): Promise<string> {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uuid', '==', uuid));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          let username = `${userData.firstname} ${userData.lastname}`;
          if (username === ' ') {
            // first name does not exist, thus last name does not exist, thus username should be uuid
            username = uuid;
          }
          return username;
        }
      } catch (error) {
        console.error(error);
      }
      return 'Unknown User'; // Fallback if user not found
    }
    try {
      const q = query(
        chat_collection_ref,
        or(
          where('user_1', '==', receiver_id),
          where('user_2', '==', receiver_id)
        )
      );
      const chats = await getDocs(q);
      for (const chat of chats.docs) {
        const chat_data = chat.data();
        let read = chat_data.read;
        // get reference to a particular set of message documents
        const message_collection_ref = collection(chat.ref, 'messages');
        // query sorting by timestamp with most recent timestamp first
        const message_q = query(
          message_collection_ref,
          orderBy('timestamp', 'desc')
        );
        // get the snapshot of this query
        const messages = await getDocs(message_q);
        const message_array = messages.docs;
        if (message_array.length > 0) {
          // messages exist
          const recent_message_data = message_array[0].data();
          if (!read && recent_message_data.senderID === receiver_id) {
            // if most recent message is not read, but person retrieving list of posts was person who sent that message,
            // then conversation should be marked read for them
            read = true;
          }

          // get username for the other person in the chat
          const username = await getUsernameByUUID(
            receiver_id === chat_data.user_1
              ? chat_data.user_2
              : chat_data.user_1
          );
          const front: Chat_Front = {
            id: chat_data.chat_id,
            other_user_name: username,
            other_user_id:
              receiver_id === chat_data.user_1
                ? chat_data.user_2
                : chat_data.user_1,
            read: read,
            recent_message: recent_message_data.message,
            time_sent: recent_message_data.timestamp,
          };
          fronts.push(front);
        }
      }
      // internal to the for-each, I need to grab the sender ID of the "newest" message (sorted via timestamp), and then compare that ID to the
      // "reciever" string that is passed as an argument. If they are not the same, then update the chat as read and move on. If they match,
      // ignore the "read" tag
    } catch (error) {
      console.error(error);
    }
    fronts.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return b.time_sent.valueOf() - a.time_sent.valueOf();
    });
    return fronts;
  }

  public async retrieveChatHistory(
    receiver_id: string,
    chat_id: string
  ): Promise<Chat | undefined> {
    if (chat_id === 'NewChat') {
      return {
        second_chatter: '',
        chatID: 'NewChat',
        messages: [],
      };
    }
    async function getUsernameByUUID(uuid: string): Promise<string> {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uuid', '==', uuid));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          let username = `${userData.firstname} ${userData.lastname}`;
          if (username === ' ') {
            // first name does not exist, thus last name does not exist, thus username should be uuid
            username = uuid;
          }
          return username;
        }
      } catch (error) {
        console.error(error);
      }
      return 'Unknown User'; // Fallback if user not found
    }

    const chat_collection_ref = collection(db, 'chats');
    try {
      const q = query(chat_collection_ref, where('chat_id', '==', chat_id));
      const chat = await getDocs(q);
      const chat_doc = chat.docs;
      if (chat_doc.length === 0) {
        console.error(`no chat with id ${chat_id} exists`);
      } else if (chat_doc.length > 1) {
        console.error(`more than one chat with id ${chat_id} exists`);
      } else {
        // only one chat exists as it should
        // get the chat info necessary
        const chat_data = chat_doc[0].data();
        const read = chat_data.read;
        let other_user: string = '';
        if (chat_data.user_1 === receiver_id) {
          other_user = chat_data.user_2;
        } else {
          other_user = chat_data.user_1;
        }

        const message_collection_ref = collection(chat_doc[0].ref, 'messages');
        const message_q = query(
          message_collection_ref,
          orderBy('timestamp', 'asc')
        );
        const messages = await getDocs(message_q);
        const message_doc_array = messages.docs;
        if (message_doc_array.length > 0) {
          const recent_message_data = message_doc_array[0].data();
          if (!read && recent_message_data.senderID !== receiver_id) {
            // if most recent message is not read, and person retrieving list of posts is not who sent that message,
            // then conversation should be marked read for them
            await updateDoc(chat_doc[0].ref, {
              read: true,
            });
          }
        }

        let message_array = new Array<Returning_Message>();

        for (const message of messages.docs) {
          const message_data = message.data();
          const name = await getUsernameByUUID(message_data.senderID);
          const return_message: Returning_Message = {
            sender_id: message_data.senderID,
            sender_name: name,
            message: message_data.message,
            time_sent: message_data.timestamp,
            message_id: message_data.id,
          };
          message_array.push(return_message);
        }

        const chat_to_return: Chat = {
          second_chatter: other_user,
          chatID: chat_data.chat_id,
          messages: message_array,
        };
        return chat_to_return;
      }
    } catch (error) {
      console.error(error);
    }
    return undefined;
  }
}
