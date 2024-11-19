import { Message } from "./chat.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion, addDoc } from 'firebase/firestore';
import { get } from "http";

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
        const chatsSnapShot = await getDocs(collection(db, 'chats'));
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
                await addDoc(collection(chat_ref, 'messages'), {
                    senderID: message.sender,
                    message: message.message,
                    timestamp: message.timestamp
                });
            }
        }
        else {
            // need to create a new chat
            const chat_uuid = uuidv4();
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
    public async unsubscribe(sender: string, receiver: string): Promise<boolean | undefined> {
        return true;
    }
}