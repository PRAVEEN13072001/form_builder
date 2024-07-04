import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create a custom hook to access the UserContext


// UserProvider component to provide user data to the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state with null
  const val = "value"
  
  return (
    <UserContext.Provider value={{ user, setUser,val }}>
      {children}
    </UserContext.Provider>
  );
};
