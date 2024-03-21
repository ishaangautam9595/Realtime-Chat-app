import React, { createContext, useState } from 'react'
import { io } from "socket.io-client";
import { host } from '../utils/APIRoutes';

export const Socket = createContext();
const SocketContext = ({children}) => {
  
  const socketS = io.connect(host);
  const [ socket ] = useState(socketS);
   
  return (
    <Socket.Provider value={{socket}}>{children}</Socket.Provider>
  )
}

export default SocketContext