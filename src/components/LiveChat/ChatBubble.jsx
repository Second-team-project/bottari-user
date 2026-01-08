import './ChatBubble.css';

/**
 * 채팅 말풍선 컴포넌트
 * @param {string} content - 메시지 내용 (텍스트 또는 이미지 URL)
 * @param {string} messageType - 메시지 타입 (TEXT | IMAGE)
 * @param {string} senderType - 발신자 타입 (USER | ADMIN)
 * @param {string} createdAt - 생성 시간
 * @param {boolean} isRead - 읽음 여부
 * @param {boolean} isMine - 내가 보낸 메시지인지
 */
export default function ChatBubble({
  content,
  messageType = 'TEXT',
  senderType,
  createdAt,
  isRead,
  isMine
}) {
  // 시간 포맷 (HH:mm)
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`chat-bubble-wrapper ${isMine ? 'mine' : 'other'}`}>
      {/* 상대방 메시지일 때 라벨 */}
      {!isMine && (
        <span className="chat-bubble-sender">상담사</span>
      )}

      <div className="chat-bubble-content-row">
        {/* 내 메시지: 시간 왼쪽 */}
        {isMine && (
          <div className="chat-bubble-meta">
            {!isRead && <span className="chat-bubble-unread">1</span>}
            <span className="chat-bubble-time">{formatTime(createdAt)}</span>
          </div>
        )}

        {/* 말풍선 */}
        <div className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>
          {messageType === 'IMAGE' ? (
            <img
              src={content}
              alt="전송된 이미지"
              className="chat-bubble-image"
              onClick={() => window.open(content, '_blank')}
            />
          ) : (
            <p className="chat-bubble-text">{content}</p>
          )}
        </div>

        {/* 상대방 메시지: 시간 오른쪽 */}
        {!isMine && (
          <div className="chat-bubble-meta">
            <span className="chat-bubble-time">{formatTime(createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
