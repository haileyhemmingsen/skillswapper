import { Message } from "./chat.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
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