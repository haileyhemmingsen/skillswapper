import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SkillSwapper from './skillswapper_components/homepage/homepage.module';
import SignUpPage from './skillswapper_components/signup/SignUpPage/signup';
import Login from './skillswapper_components/login/LoginPage/LoginPage';
import Posting from './skillswapper_components/posting/posting';
import UserPage from './skillswapper_components/user_page/UserPage';
import './App.css';
import React from 'react';
import CreatePost from './skillswapper_components/createPost/CreatePost';
import { LoginProvider, LoginContext } from './context/Login.tsx';
import EditPost from './skillswapper_components/user_page/editPost/EditPost.jsx';
import ChatPage from './skillswapper_components/chatui/ChatPage';
import InboxPage from './skillswapper_components/inbox/InboxPage';

import { Navigate } from 'react-router-dom';

// AuthorizedRoute Component
const AuthorizedRoute = ({ children }) => {
  const loginContext = React.useContext(LoginContext);
  // console.log('privateroute: ' + loginContext.loggedIn);
  return loginContext.loggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App">
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/homepage"
              element={
                <AuthorizedRoute>
                  <SkillSwapper />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/createpost"
              element={
                <AuthorizedRoute>
                  <CreatePost />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/posting/:id"
              element={
                <AuthorizedRoute>
                  <Posting />
                </AuthorizedRoute>
              }
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/userpage"
              element={
                <AuthorizedRoute>
                  <UserPage />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/editpost/:id"
              element={
                <AuthorizedRoute>
                  <EditPost />
                </AuthorizedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <AuthorizedRoute>
                  <ChatPage />
                </AuthorizedRoute>
              }
            />
            <Route
              path="inbox"
              element={
                <AuthorizedRoute>
                  <InboxPage />
                </AuthorizedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
}

export default App;
