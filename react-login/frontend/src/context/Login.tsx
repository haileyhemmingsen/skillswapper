import React, { useState, useEffect, createContext, PropsWithChildren } from "react";

export const LoginContext = createContext({
  userFirstName: '',
  setUserFirstName: (userFirstName: string) => {},
  userLastName: '',
  setUserLastName: (userLastName: string) => {},
  id: '',
  setId: (id: string) => {},
  zip: '',
  setZip: (zip: string) => {},
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userFirstName, setUserFirstName] = useState(() => sessionStorage.getItem('userFirstName') || '');
  const [userLastName, setUserLastName] = useState(() => sessionStorage.getItem('userLastName') || '');
  const [id, setId] = useState(() => sessionStorage.getItem('id') || '');
  const [zip, setZip] = useState(() => sessionStorage.getItem('zip') || '');

  // Sync state changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('userFirstName', userFirstName);
  }, [userFirstName]);
  useEffect(() => {
    sessionStorage.setItem('userLastName', userLastName);
  }, [userLastName]);

  useEffect(() => {
    sessionStorage.setItem('id', id);
  }, [id]);

  useEffect(() => {
    sessionStorage.setItem('zip', zip);
  }, [zip]);


  return (
    <LoginContext.Provider
      value={{
        userFirstName,
        setUserFirstName,
        userLastName,
        setUserLastName,
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