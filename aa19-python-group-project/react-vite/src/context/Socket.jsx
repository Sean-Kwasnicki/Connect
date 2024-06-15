import { createContext, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = io.connect("/");

  return (
    <>
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    </>
  );
};
