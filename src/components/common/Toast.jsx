import "./Toast.css";

import { useEffect } from "react";

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  // ===== 시간 세팅
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // 부모의 상태를 false로 만듦
    }, duration);
    return () => clearTimeout(timer); // 언마운트 시 타이머 클리어
    }, [onClose, duration]);

  // ===== 타입별 이모지
  const typeIcon = {
    success: '✅',
    error: '🚨',
    info: 'ℹ️',
    warning: '⚠️'
  };

  return(
    <>
      {/* 전체 영역 */}
      <div className="toast-container">
        {/* 메세지 영역 */}
        <div className={`toast-msg-wrapper toast-wrapper-${type}`}>
          <span>{typeIcon[type] || '📢'}</span>
          <p className="toast-msg">메세지: {message}</p>
        </div>
      </div>
    </>
  )
};