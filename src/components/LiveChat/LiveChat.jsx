import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useSocket } from '../../contexts/SocketContext';
import { createRoom, getMessages } from '../../api/chatApi.js';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatLoginModal from './ChatLoginModal';
import './LiveChat.css';
import { toast } from 'sonner';
import Loading from '../common/Loading.jsx';

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
  const [guestData, setGuestData] = useState(null);  // { booker, reservation }
  const [guestSocket, setGuestSocket] = useState(null);

  // 현재 사용할 소켓 (회원이면 memberSocket, 비회원이면 guestSocket)
  const socket = isLoggedIn ? memberSocket : guestSocket;

  // API 중복 호출 방지용 (useRef는 즉시 반영 방지에 적합)
  const isInitRef = useRef(false);

  // ===== 스크롤 top 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===== 로그인/인증 체크
  useEffect(() => {
    if (!loading && !isLoggedIn && !guestData) {
      setShowLoginModal(true);
    }
  }, [loading, isLoggedIn, guestData]);

  // ===== SW에 채팅 페이지 상태 알림
  useEffect(() => {
    const sw = navigator.serviceWorker?.controller;
    sw?.postMessage({ type: 'CHAT_OPEN' });

    const handleBeforeUnload = () => {
      sw?.postMessage({ type: 'CHAT_CLOSE' });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sw?.postMessage({ type: 'CHAT_CLOSE' });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // ===== 비회원 인증 성공
  const handleGuestSuccess = (data) => {
    // data = { accessToken, booker, reservation }
    setGuestData(data);
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
    if (isInitRef.current) return; // 이미 초기화 중이면 차단

    const initRoom = async () => {
      isInitRef.current = true; // 진입하자마자 깃발 꽂기
      try {
        // 1. 채팅방 생성/조회 (없으면 생성, 있으면 반환)
        const room = await createRoom();
        setRoomId(room.id);

        // 2. 이전 메시지 로드
        const msgList = await getMessages(room.id);
        setMessages(msgList || []);
      } catch (err) {
        console.error('채팅방 초기화 실패:', err);
        toast.error('에러가 발생했습니다. 새로고침 해주세요.');
        isInitRef.current = false; // 실패 시 재시도 가능하도록 초기화
      }
    };

    initRoom();
  }, [isLoggedIn, user]);

  // ===== 채팅방 생성/입장 (비회원)
  useEffect(() => {
    if (!guestData?.booker?.id || !guestData?.accessToken) return;
    if (isInitRef.current) return; // 이미 초기화 중이면 차단

    const initGuestRoom = async () => {
      isInitRef.current = true; // 진입하자마자 깃발 꽂기
      try {
        // 1. 채팅방 생성/조회 (bookerId + 비회원 토큰 전달)
        const room = await createRoom({ bookerId: guestData.booker.id }, guestData.accessToken);
        setRoomId(room.id);

        // 2. 이전 메시지 로드
        const msgList = await getMessages(room.id, guestData.accessToken);
        setMessages(msgList || []);
      } catch (err) {
        console.error('비회원 채팅방 초기화 실패:', err);
        toast.error('에러가 발생했습니다. 새로고침 해주세요.');
        isInitRef.current = false; // 실패 시 재시도 가능하도록 초기화
      }
    };

    initGuestRoom();
  }, [guestData]);

  // ===== 소켓 연결 및 이벤트
  useEffect(() => {
    if (!socket || !roomId) return;

    // 방 입장 (userType 전달)
    socket.emit('join', { roomId, userType: 'USER' });
    setIsConnected(true);

    // 메시지 수신
    const handleMessage = (message) => {
      setMessages(prev => [...prev, message]);

      // 상대방(ADMIN) 메시지면 바로 읽음 처리
      if (message.senderType === 'ADMIN') {
        socket.emit('read', { messageId: message.id, roomId });
      }
    };

    // 읽음 처리 수신 (상대방이 읽었을 때)
    const handleMessagesRead = ({ messageIds }) => {
      setMessages(prev => prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
      ));
    };

    socket.on('message', handleMessage);
    socket.on('messagesRead', handleMessagesRead);

    // 언마운트시 중단
    return () => {
      socket.off('message', handleMessage);
      socket.off('messagesRead', handleMessagesRead);
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

  // 인증 여부 (회원 또는 비회원 데이터 있으면 true)
  const isAuthenticated = isLoggedIn || !!guestData;

  // 로딩 중
  if (loading) {
    return (
      <div className="live-chat-loading">
        <Loading fullScreen={false} />
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

        {/* 비회원 경고 문구 */}
        {guestData && (
          <div className="live-chat-guest-warning">
            비회원은 페이지를 나가거나 새로고침 시 재인증이 필요합니다.
          </div>
        )}

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
