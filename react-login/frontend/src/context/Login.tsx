import React, { useState, useEffect, createContext, PropsWithChildren } from "react";

export const LoginContext = createContext({
  userName: '',
  setUserName: (userName: string) => {},
  id: '',
  setId: (id: string) => {},
  zip: '',
  setZip: (zip: string) => {},
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || '');
  const [id, setId] = useState(() => sessionStorage.getItem('id') || '');
  const [zip, setZip] = useState(() => sessionStorage.getItem('zip') || '');

  // Sync state changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('userName', userName);
  }, [userName]);

  useEffect(() => {
    sessionStorage.setItem('id', id);
  }, [id]);

  useEffect(() => {
    sessionStorage.setItem('zip', zip);
  }, [zip]);


  return (
    <LoginContext.Provider
      value={{
        userName,
        setUserName,
        id,
        setId,
        zip,
        setZip,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};