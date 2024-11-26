import React, { useState, useEffect } from 'react';
import styles from './ChatPage.module.css';
import sendButton from '../../images/sendButton.svg';
import axios from 'axios';
import { LoginContext } from "../../context/Login.tsx";
import { useNavigate } from 'react-router-dom';


const MessageInput = () => {
    const [newMessage, setNewMessage] = useState('');
    const [chatID, setChatID] = useState('');
    const [receiverID, setReceiverID] = useState('');

    const loginContext = React.useContext(LoginContext);

    const chat_info_string = sessionStorage.getItem('chat_info');
    const chat_info = JSON.parse(chat_info_string);
    const navigate = useNavigate();

    useEffect(() => {
        setChatID(chat_info.chat_id);
        setReceiverID(chat_info.receiver_id);
    }, [chat_info]);
    

    const handleSendMessage = async (event) => {
        event.preventDefault();
        console.log('calling handle send message');
        const dto = {
            chatID: chatID === "NewChat" ? undefined : chatID,
            message: newMessage,
            sender: loginContext.id,
            receiver: receiverID,
            timestamp: new Date()
        }
        
        try {
            console.log(dto);
            const response = await axios.post('http://localhost:3080/api/v0/sendMessage',
                dto, 
                {headers: { "Content-Type": "application/json" }, 
                withCredentials: true
            });
            console.log(response);
            if(response.data !== undefined) {
                setNewMessage('');
                console.log('got to end of useEffect');
                setChatID(response.data);
                const new_chat_info = {
                    chat_id: response.data,
                    receiver_id: chat_info.receiver_id
                };
                const new_chat_info_string = JSON.stringify(new_chat_info);
                
                sessionStorage.setItem('chat_info', new_chat_info_string);
                navigate(`/chat/${response.data}`);
            }
            else {
                console.log('got to end of useEffect with undefined response');
            }
            
        }
        catch (error) {
            console.error(error);
        }
        
      };



  return (
    <form className={styles.messageInputForm}>
      <div className={styles.messageInputWrapper}>
        <input
          type="text"
          id="messageInput"
          className={styles.messageInput}
          value={newMessage}
          onChange={(e) => {setNewMessage(e.target.value)}}
          placeholder="Type..."
          aria-label="Type a message"
        />
        <button type="submit" className={styles.sendButton} onClick={handleSendMessage}>
          <img src={sendButton} alt="Send button" />
        </button>
      </div>
</form>

  );
}

export default MessageInput;