import "./ChatLoginModal.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from 'lucide-react';
import { motion } from "framer-motion";

import { guestAuth } from "../../api/chatApi.js";

/**
 * 채팅용 로그인 모달
 * @param {function} onClose - 모달 닫기
 * @param {function} onGuestSuccess - 비회원 인증 성공 시 (booker 정보 전달)
 */
export default function ChatLoginModal({ onClose, onGuestSuccess }) {
  // ===== local states
  const [inputs, setInputs] = useState({
    code: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // ===== 입력 핸들러
  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  // ===== 비회원 채팅 인증
  async function handleGuestAuth(e) {
    e.preventDefault();

    const code = inputs.code.toUpperCase().trim();
    const password = inputs.password.trim();

    if (!code || !password) {
      toast.error('예약코드와 비밀번호를 입력해주세요.')
      return;
    }

    // 예약코드 형식 검증
    const firstChar = code.charAt(0);
    const secondChar = code.charAt(1);

    if (!['D', 'S'].includes(firstChar) || !['G', 'M'].includes(secondChar)) {
      toast.error('예약코드와 비밀번호를 다시 확인해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 비회원 채팅 인증 API 호출
      const data = await guestAuth({ code, password });

      // 인증 성공 → booker, reservation 정보 전달
      onGuestSuccess(data);
      toast.success('인증되었습니다.');
    } catch (err) {
      toast.error('예약코드와 비밀번호를 다시 확인해 주세요.');
      console.error('비회원 채팅 인증 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // ===== 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ===== 소셜 로그인
  function handleSocial(provider) {
    // 로그인 후 돌아올 페이지를 저장
    sessionStorage.setItem('redirectAfterLogin', '/chat');
    window.location.replace(`${import.meta.env.VITE_SERVER_URL}/api/user/auth/social/${provider}`)
  }

  return (
    <>
      {/* 불투명 배경 */}
      <motion.div
        className="chat-login-modal-background"
        initial={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
        exit={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* 전체 컨테이너 */}
      <motion.div
        className="chat-login-modal-container"
        initial={{ opacity: 0.9, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0.9, filter: "blur(2px)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="chat-login-modal-x" onClick={onClose}>
          <X size={30} />
        </div>

        {/* 페이지 제목 */}
        <div className="chat-login-modal-title-wrapper">
          <h2 className="chat-login-modal-title">로그인</h2>
          <p className="chat-login-modal-subtitle">상담을 위해 예약 확인이 필요합니다.</p>
        </div>

        {/* 버튼 영역 */}
        <div className="chat-login-modal-btn-container">

          {/* 카카오 버튼 */}
          <button
            type="button"
            className="chat-login-modal-kakao-btn-wrapper"
            onClick={() => handleSocial('kakao')}
          >
            <img src={kakaoBtn} alt="카카오 로그인" className="chat-login-modal-kakao-btn" />
            <span className="chat-login-modal-kakao-text">
              카카오 로그인
            </span>
          </button>


          {/* 비회원 인증 입력창 */}
          <form onSubmit={handleGuestAuth} className="chat-login-modal-form">
            <div className="chat-login-modal-input-container">
              {/* 구분선 */}
              <div className="chat-login-modal-divider">
                <span>또는</span>
              </div>
              
              <input
                type="text"
                name="code"
                className='chat-login-modal-input'
                placeholder='예약 코드'
                value={inputs.code}
                onChange={handleChange}
                disabled={isLoading}
              />
              <input
                type="password"
                name="password"
                className='chat-login-modal-input'
                placeholder='비밀번호'
                value={inputs.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {/* 비회원 인증 버튼 */}
            <button
              type="submit"
              className="chat-login-modal-guest-btn-wrapper"
              disabled={isLoading}
            >
              <span className="chat-login-modal-guest-text">
                {isLoading ? '인증 중...' : '비회원으로 상담하기'}
              </span>
            </button>
          </form>

        </div>
      </motion.div>
    </>
  )
}
