import "./ReserveLoginModal.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function ReserveLoginModal({ modalFlgFasle }) {
  // ===== hooks
  const navigate = useNavigate();
  // ========================
  // ||     스크롤 방지     ||
  // ========================
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);  

  // =============================
  // ||     소셜 로그인 요청     ||
  function handleSocial(provider) {
    window.location.replace(`${import.meta.env.VITE_SERVER_URL}/api/user/auth/social/${provider}`)
  }

  // ========================
  // ||     로그인 닫기     ||
  function handleClose() {
    modalFlgFasle()
    navigate('/')
  }
  

  return(
    <>
      {/* 불투명 배경 */}
      <motion.div
        className="reserve-login-modal-background"
        initial={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
        exit={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
        transition={{ duration: 0.3 }}
      />

      {/* 전체 컨테이너 */}
      <motion.div
        className="reserve-login-modal-container"
        initial={{ opacity: 0.9, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0.9, filter: "blur(2px)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="reserve-login-modal-x"
          onClick={modalFlgFasle}
        >
          <X size={30} />
        </div>

        {/* 페이지 제목 */}
        <div className="reserve-login-modal-title-wrapper page-modal-title-wrapper">
          <h2 className="reserve-login-modal-title">로그인</h2>
        </div>

        {/* 유도 문구 */}
        <div className="reserve-login-modal-text-warpper page-modal-title-wrapper">
          <p className="reserve-login-modal-text reserve-login-modal-text-web">로그인 하시면 예약 관리가 더 쉬워져요!</p>
        </div>

        {/* 버튼 영역 */}
        <div className="reserve-login-modal-btn-container">

          {/* 카카오 버튼 */}
          <button type="button" className="reserve-login-modal-kakao-btn-wrapper" onClick={ () => handleSocial('kakao') }>
            <img src={kakaoBtn} alt="카카오 로그인" className="reserve-login-modal-kakao-btn" />
            <span className="social-login-page-kakao-text">
              카카오 로그인
            </span>
          </button>

          {/* 비회원 예약 버튼 */}
          <button type="button" className="reserve-login-modal-guest-btn-wrapper" onClick={modalFlgFasle}>
            <span className="reserve-login-modal-gust-text">
              비회원으로 예약하기
            </span>
          </button>

        </div>


      </motion.div>
    </>
  )
};