import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './skillswapper_components/landing/landing';
import Login from './skillswapper_components/login/login';
import SkillSwapper from './skillswapper_components/homepage/homepage.module';
import FigmaLogin from './skillswapper_components/figmaLogin/LoginPage/LoginPage';
import Posting from './skillswapper_components/posting/posting';
import './App.css';
import { useEffect, useState } from 'react';

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
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<FigmaLogin setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/homepage" element={<SkillSwapper />} /> 
          <Route path='/posting' element={<Posting/>} />
          {/* <Route path="/figma-login" element={<FigmaLogin />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App


