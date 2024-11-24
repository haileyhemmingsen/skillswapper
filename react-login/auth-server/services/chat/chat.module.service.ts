import { Chat_Front, Message, Chat, Returning_Message } from "./chat.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion, addDoc, where, query, or, orderBy } from 'firebase/firestore';
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
    public async sendMessage(message: Message, user_id: string): Promise<string | undefined> {
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
                    senderID: user_id,
                    message: message.message,
                    timestamp: message.timestamp
                });
                // await addDoc(collection(chat_ref, 'messages'), {
                //     senderID: message.sender,
                //     message: message.message,
                //     timestamp: message.timestamp
                // });
                return message.chatID;
            }
        }
        else {
            // need to create a new chat
            const chat_uuid = uuidv4();

            await setDoc(doc(db, 'chats', chat_uuid), {
                chat_id: chat_uuid,
                user_1: user_id,
                user_2: message.receiver,
                read: false
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
        return message.chatID;
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




    // ive realized a new issue. I cannot mark a chat as read instantly. I instead actually need to retrieve all chats, and know what their "read" status is, without updating it, and then only retrieve messages for a chat once I have the user click into that chat
    // furthermore, I can still actually retrieve the most 

    // this function SOLELY RETURNS ALL OF THE CHATS, MARKING THEM AS READ OR NOT, THEIR ID, AND THE MOST RECENT MESSAGE. THIS GOES NO DEEPER. IT WILL ORDER THEM CORRECTLY
    public async retrieveChats(receiver_id: string): Promise <Chat_Front[] | undefined> {
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
                    let username = `${userData.firstname} ${userData.lastname}`
                    if (username === ' ') {
                        // first name does not exist, thus last name does not exist, thus username should be uuid
                        username = uuid
                    }
                    return username;
                }
            }
            catch (error) {
                console.error(error);
            }
            return 'Unknown User'; // Fallback if user not found
        }

        try {
            const q = query(chat_collection_ref, or(where("user_1", '==', receiver_id), where("user_2", '==', receiver_id)));
            const chats = await getDocs(q);
            for (const chat of chats.docs) {
                const chat_data = chat.data();
                let read = chat_data.read;
                // get reference to a particular set of message documents
                const message_collection_ref = collection(chat.ref, "messages");
                // query sorting by timestamp with most recent timestamp first
                const message_q = query(message_collection_ref, orderBy("timestamp", "desc"));
                // get the snapshot of this query
                const messages = await getDocs(message_q);
                
                const message_array = messages.docs;
                if (message_array.length > 0) {
                    // messages exist
                    const recent_message_data = message_array[0].data();
                    if (!read && (recent_message_data.senderID === receiver_id)) {
                        read = true
                    }
                    
                    // get username for the other person in the chat
                    const username = await getUsernameByUUID(receiver_id === chat_data.user_1 ? chat_data.user_2 : chat_data.user_1);

                    const front : Chat_Front = {
                        id: chat_data.chat_id,
                        other_user_name: username,
                        read: read,
                        recent_message: recent_message_data.message,
                        time_sent: recent_message_data.timestamp
                    }
                    fronts.push(front);
                }
            }

            // internal to the for-each, I need to grab the sender ID of the "newest" message (sorted via timestamp), and then compare that ID to the 
            // "reciever" string that is passed as an argument. If they are not the same, then update the chat as read and move on. If they match, 
            // ignore the "read" tag
        }
        catch (error) {
            console.error(error);
        }
        
        const sorted_fronts = fronts.sort((a,b) => {
            if(a.read !== b.read) {
                return a.read ? 1 : -1;
            }
            return a.time_sent.getTime() - b.time_sent.getTime();
        })
        return sorted_fronts;
    }

    // NOW WHEN A CHAT IS CLICKED ON, THEN WE CAN MARK THE CHAT AS READ IF IT IS NOT YET READ, AND 


    // public async retrieveMessage(receiver: string, id: string): Promise <boolean | undefined> {
    //     const chat_collection_ref = collection(db, 'chats');

    //     try {
    //         const q = query(chat_collection_ref, or(where("user1", '==', receiver), where("user2", '==', receiver)));
    //         const chats = await getDocs(q);
    //         for (const chat of chats.docs) {
    //             // const data = chat.data();
    //             // get reference to a particular set of message documents
    //             const message_collection_ref = collection(chat.ref, "messages");
    //             // query sorting by timestamp with most recent timestamp first
    //             const message_q = query(message_collection_ref, orderBy("timestamp", "desc"));
    //             // get the snapshot of this query
    //             const messages = await getDocs(message_q);
                
    //             const message_array = messages.docs;
    //             if (message_array.length > 0) {
    //                 // messages exist
    //                 const recent_message_data = message_array[0].data();

    //                 if (recent_message_data.senderID === receiver) {
    //                     // the most recent message's sender is the person retrieving, do not update the "read" status, and assume the chat to be marked as read = true

    //                 }
    //                 else {
    //                     // "read status must be set to true"
    //                     await updateDoc(chat.ref, {
    //                         read: true
    //                     })
                        
    //                 }
    //             }
                
    //         }

    //         // internal to the for-each, I need to grab the sender ID of the "newest" message (sorted via timestamp), and then compare that ID to the 
    //         // "reciever" string that is passed as an argument. If they are not the same, then update the chat as read and move on. If they match, 
    //         // ignore the "read" tag
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    //     return true;
    // }


    public async retrieveChatHistory(receiver_id: string, chat_id: string): Promise<Chat | undefined> {
        if (chat_id === 'NewChat') {
            return {
                second_chatter: '',
                chatID: 'NewChat',
                messages: []
            }
        }
        async function getUsernameByUUID(uuid: string): Promise<string> {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uuid', '==', uuid));
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    let username = `${userData.firstname} ${userData.lastname}`
                    if (username === ' ') {
                        // first name does not exist, thus last name does not exist, thus username should be uuid
                        username = uuid
                    }
                    return username;
                }
            }
            catch (error) {
                console.error(error);
            }
            return 'Unknown User'; // Fallback if user not found
        }

        const chat_collection_ref = collection(db, 'chats');
        try {
            const q = query(chat_collection_ref, where("chat_id", "==", chat_id));
            const chat = await getDocs(q);
            const chat_doc = chat.docs;
            if (chat_doc.length === 0) {
                console.error(`no chat with id ${chat_id} exists`);
            }
            else if (chat_doc.length > 1) {
                console.error(`more than one chat with id ${chat_id} exists`);
            }
            else {
                // only one chat exists as it should
                // get the chat info necessary
                const chat_data = chat_doc[0].data();
                let other_user : string = "";
                if(chat_data.user_1 === receiver_id) {
                    other_user = chat_data.user_2;
                }
                else {
                    other_user = chat_data.user_1;
                }

                const message_collection_ref = collection(chat_doc[0].ref, "messages");
                const message_q = query(message_collection_ref, orderBy("timestamp", "asc"));
                const messages = await getDocs(message_q);
                let message_array = new Array<Returning_Message>();
                
                for (const message of messages.docs) {
                    const message_data = message.data();
                    const name = await getUsernameByUUID(message_data.senderID);
                    const return_message : Returning_Message = {
                        sender_id: message_data.senderID,
                        sender_name: name,
                        message: message_data.message,
                        time_sent: message_data.timestamp,
                        message_id: message_data.id
                    }
                    message_array.push(return_message);
                }

                const chat_to_return : Chat = {
                    second_chatter: other_user,
                    chatID: chat_data.chat_id,
                    messages: message_array
                }
                return chat_to_return;
            }
        }
        catch (error) {
            console.error(error);
        }
        return undefined;
    }
}