import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useSocket } from '../../contexts/SocketContext';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatLoginModal from './ChatLoginModal';
import './LiveChat.css';

export default function LiveChat() {
  // ===== hooks
  const navigate = useNavigate();
  const memberSocket = useSocket();  // 회원용 소켓 (Context)
  const { isLoggedIn, user, loading } = useSelector(state => state.auth);

  // ===== local states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // 비회원 상태
  const [booker, setBooker] = useState(null);
  const [guestSocket, setGuestSocket] = useState(null);

  // 현재 사용할 소켓 (회원이면 memberSocket, 비회원이면 guestSocket)
  const socket = isLoggedIn ? memberSocket : guestSocket;

  // ===== 로그인/인증 체크
  useEffect(() => {
    if (!loading && !isLoggedIn && !booker) {
      setShowLoginModal(true);
    }
  }, [loading, isLoggedIn, booker]);

  // ===== 비회원 인증 성공
  const handleGuestSuccess = (bookerData) => {
    setBooker(bookerData);
    setShowLoginModal(false);

    // 비회원용 소켓 연결
    const newSocket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('🔌 비회원 소켓 연결됨:', newSocket.id);
    });

    setGuestSocket(newSocket);
  };

  // ===== 채팅방 생성/입장 (회원)
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const initRoom = async () => {
      try {
        // 1. 기존 채팅방 조회
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/rooms/my`, {
          credentials: 'include',
        });

        let room;
        if (res.ok) {
          const data = await res.json();
          room = data.data;
        }

        // 2. 없으면 생성
        if (!room) {
          const createRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/rooms`, {
            method: 'POST',
            credentials: 'include',
          });
          const createData = await createRes.json();
          room = createData.data;
        }

        setRoomId(room.id);

        // 3. 이전 메시지 로드
        const msgRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/rooms/${room.id}/messages`, {
          credentials: 'include',
        });
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.data || []);
        }
      } catch (err) {
        console.error('채팅방 초기화 실패:', err);
      }
    };

    initRoom();
  }, [isLoggedIn, user]);

  // ===== 채팅방 생성/입장 (비회원)
  useEffect(() => {
    if (!booker?.id) return;

    const initGuestRoom = async () => {
      try {
        // 1. 기존 채팅방 조회
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/rooms/guest/${booker.id}`, {
          credentials: 'include',
        });

        let room;
        if (res.ok) {
          const data = await res.json();
          room = data.data;
        }

        // 2. 없으면 생성
        if (!room) {
          const createRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/rooms/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ bookerId: booker.id }),
          });
          const createData = await createRes.json();
          room = createData.data;
        }

        setRoomId(room.id);

        // 3. 이전 메시지 로드
        const msgRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/rooms/${room.id}/messages`, {
          credentials: 'include',
        });
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.data || []);
        }
      } catch (err) {
        console.error('비회원 채팅방 초기화 실패:', err);
      }
    };

    initGuestRoom();
  }, [booker]);

  // ===== 소켓 연결 및 이벤트
  useEffect(() => {
    if (!socket || !roomId) return;

    // 방 입장
    socket.emit('join', roomId);
    setIsConnected(true);

    // 메시지 수신
    const handleMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket, roomId]);

  // ===== 컴포넌트 언마운트 시 비회원 소켓 정리
  useEffect(() => {
    return () => {
      if (guestSocket) {
        guestSocket.close();
      }
    };
  }, [guestSocket]);

  // ===== 메시지 전송
  const handleSendMessage = (content, messageType) => {
    if (!socket || !roomId) return;

    socket.emit('message', {
      roomId,
      senderType: 'USER',
      content,
      messageType,
    });
  };

  // ===== 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // ===== 모달 닫기
  const handleModalClose = () => {
    setShowLoginModal(false);
    navigate(-1);  // 로그인 안 하면 뒤로
  };

  // 인증 여부 (회원 또는 비회원)
  const isAuthenticated = isLoggedIn || !!booker;

  // 로딩 중
  if (loading) {
    return (
      <div className="live-chat-loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* 로그인 모달 */}
      {showLoginModal && (
        <ChatLoginModal
          onClose={handleModalClose}
          onGuestSuccess={handleGuestSuccess}
        />
      )}

      {/* 채팅 페이지 */}
      <div className="live-chat-container">
        {/* 헤더 */}
        <div className="live-chat-header">
          <button className="live-chat-back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="live-chat-title">1:1 상담</h2>
          <div className="live-chat-header-spacer" />
        </div>

        {/* 메시지 목록 */}
        <ChatMessageList messages={messages} myType="USER" />

        {/* 입력창 */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected || !isAuthenticated}
        />
      </div>
    </>
  );
}
