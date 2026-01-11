import { useState, useRef } from 'react';
import { Image, Send } from 'lucide-react';
import { toast } from 'sonner';
import './ChatInput.css';
import { sendImg } from '../../api/chatApi';

/**
 * 채팅 입력창 컴포넌트
 * @param {function} onSendMessage - 메시지 전송 콜백 (content, messageType)
 * @param {boolean} disabled - 비활성화 여부
 */
export default function ChatInput({ onSendMessage, disabled = false }) {
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);

  // 텍스트 전송
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSendMessage(trimmed, 'TEXT');
    setText('');
  };

  // 이미지 버튼 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 선택
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 전송 가능합니다.');
      return;
    }

    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      toast.error('5MB 이하 이미지만 전송 가능합니다.');
      return;
    }

    // 파일 업로드 후 URL 받아서 전송
    try {
      const formData = new FormData();
      formData.append('img', file);

      const response = await sendImg(formData);

      onSendMessage(response, 'IMAGE');
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      toast.error('이미지 업로드에 실패했습니다.');
    }

    // input 초기화
    e.target.value = '';
  };

  // Enter 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      {/* 이미지 버튼 */}
      <button
        type="button"
        className="chat-input-image-btn"
        onClick={handleImageClick}
        disabled={disabled}
      >
        <Image size={22} />
      </button>

      {/* 숨겨진 파일 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* 텍스트 입력 */}
      <input
        type="text"
        className="chat-input-text"
        placeholder="메시지를 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      {/* 전송 버튼 */}
      <button
        type="submit"
        className="chat-input-send-btn"
        disabled={disabled || !text.trim()}
      >
        <Send size={20} />
      </button>
    </form>
  );
}
