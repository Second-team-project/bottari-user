import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

// 소켓 객체 가져오는 훅
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { isLoggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    // 로그인 상태일 때만 소켓 연결
    if (isLoggedIn) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('🔌 소켓 연결됨:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 소켓 해제됨');
      });

      setSocket(newSocket);

      // 클린업: 컴포넌트 언마운트 시 소켓 해제
      return () => {
        newSocket.close();
      };
    }
  }, [isLoggedIn]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
