import { Message } from "./chat.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion, addDoc, where, query, or } from 'firebase/firestore';
import { get } from "http";

/*
send messages,
upon message sent, 

frontend continually query for new messages when clicked into a specific chat window

upon loading all of the different chats, chats will be ordered by new messages 
(as in the chat has messages unseen by this user), newest message (time sent)
ideally mark the chats in frontend somehow to show that they have unread messages
*/

export class ChatService {
    // if (newMessage.trim()) {
    //   db.collection('chats')
    //     .doc(chatId)
    //     .collection('messages')
    //     .add({
    //       senderId: currentUser.id,
    //       receiverId: otherUser.id,
    //       text: newMessage,
    //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     });
      
    // }
    public async sendMessage(message: Message, user_id: string): Promise<boolean | undefined> {
        // we are sending a message here
        if(message.chatID !== undefined) {
            // then chat already exists
            console.log(message.chatID);
            const chat_ref = doc(db, 'chats', message.chatID);
            const chat_snapshot = await getDoc(chat_ref);
            if (chat_snapshot.exists()) {
                // below is how to access the chats
                // const message_ref = collection(chat_ref, 'messages');
                // const message_snapshot = await getDocs(message_ref);


                // here is how to add the message:
                // https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference#add
                const message_uuid = uuidv4();
                await setDoc(doc(chat_ref, 'messages', message_uuid), {
                    id: message_uuid,
                    senderID: message.sender,
                    message: message.message,
                    timestamp: message.timestamp
                });
                // await addDoc(collection(chat_ref, 'messages'), {
                //     senderID: message.sender,
                //     message: message.message,
                //     timestamp: message.timestamp
                // });
            }
        }
        else {
            // need to create a new chat
            const chat_uuid = uuidv4();

            await setDoc(doc(db, 'chats', chat_uuid), {
                chat_id: chat_uuid,
                user_1: message.sender,
                user_2: message.receiver,
            });
            const chat_ref = doc(db, 'chats', chat_uuid);
            // create new collection
            const message_ref = collection(chat_ref, 'messages');
            const message_uuid = uuidv4(); 
            await setDoc(doc(message_ref, 'messages', message_uuid), {
                id: message_uuid,
                senderID: message.sender,
                message: message.message,
                timestamp: message.timestamp,
                read: false
            })
            
            // upon creating new chat, need to add sender ID to chat doc, receiver ID to chat doc, 
            // the messages collection, and then add the message to the messages collection
        }
        return true;
    }
     // Listen to changes in the messages collection for this chat
    // const unsubscribe = db
    //   .collection('chats')
    //   .doc(chatId)
    //   .collection('messages')
    //   .orderBy('timestamp')
    //   .onSnapshot((snapshot) => {
    //     setMessages(snapshot.docs.map((doc) => doc.data()));
    //   });
    // public async unsubscribe(sender: string, receiver: string): Promise<boolean | undefined> {
    //     return true;
    // }

    public async retrieveMessage(receiver: string, id: string): Promise <boolean | undefined> {
        const chat_collection_ref = collection(db, 'chats');

        try {
            const q = query(chat_collection_ref, or(where("user1", '==', receiver), where("user2", '==', receiver)));
            const chats = await getDocs(q);
            for (const chat of chats.docs) {
                const data = chat.data();
                // i need to get the most recent message

                if(data.senderID === receiver) { // this is currently wrong, 
                                                 // i need to use the senderID of the most recent message of the current chat
                    // then person checking is the same as sent, thus messages are read REGARDLESS of actually read status
                    
                }
            }

            // internal to the for-each, I need to grab the sender ID of the "newest" message (sorted via timestamp), and then compare that ID to the 
            // "reciever" string that is passed as an argument. If they are not the same, then update the chat as read and move on. If they match, 
            // ignore the "read" tag
        }
        catch (error) {
            console.error(error);
        }

        return true;
    }

}