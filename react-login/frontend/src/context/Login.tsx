import React from "react";
import { PropsWithChildren, useState, createContext } from "react";
 
export const LoginContext = createContext({
  userName: '',
  setUserName: (userName: string) => {},
  accessToken: '',
  setAccessToken: (accessToken: string) => {},
  id: '',
  setId: (id: string) => {},
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [id, setId] = useState('');
  return (
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken, id, setId}}>
      {children}
    </LoginContext.Provider>
  );
};