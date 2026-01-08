import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import './ChatMessageList.css';

/**
 * 메시지 목록 컴포넌트
 * @param {Array} messages - 메시지 배열
 * @param {string} myType - 내 타입 (USER)
 */
export default function ChatMessageList({ messages = [], myType = 'USER' }) {
  const listRef = useRef(null);

  // 새 메시지 오면 스크롤 맨 아래로
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-message-list" ref={listRef}>
      {messages.length === 0 ? (
        <div className="chat-message-empty">
          <p>상담사에게 문의해보세요!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            content={msg.content}
            messageType={msg.messageType}
            senderType={msg.senderType}
            createdAt={msg.createdAt}
            isRead={msg.isRead}
            isMine={msg.senderType === myType}
          />
        ))
      )}
    </div>
  );
}
