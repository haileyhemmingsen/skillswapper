import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SkillSwapper from './skillswapper_components/homepage/homepage.module';
import SignUpPage from './skillswapper_components/signup/SignUpPage/signup';
import Login from './skillswapper_components/login/LoginPage/LoginPage';
import Posting from './skillswapper_components/posting/posting';
import './App.css';
import { useEffect, useState } from 'react';
import CreatePost from './skillswapper_components/createPost/CreatePost';
import ChatPage from './skillswapper_components/chatui/ChatPage'; 
import InboxPage from './skillswapper_components/inbox/InboxPage'; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem('user'))
  
    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }
  
    // If the token exists, verify it with the auth server to see if it is valid
    fetch('http://localhost:3080/verify', {
      method: 'POST',
      headers: {
        'jwt-token': user.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        setLoggedIn('success' === r.message)
        setEmail(user.email || '')
      })
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/homepage" element={<SkillSwapper />} /> 
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/posting/:id" element={<Posting />} />
          <Route path="/signup" element={<SignUpPage setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/inbox" element={<InboxPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App


