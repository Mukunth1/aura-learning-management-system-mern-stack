import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket connects to port 5000 in dev, or window.location.origin
    const socketServerUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
    const socketInstance = io(socketServerUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
