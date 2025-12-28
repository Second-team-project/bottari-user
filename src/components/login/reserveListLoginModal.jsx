import "./ReserveListLoginModal.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { X } from 'lucide-react';
import { motion } from "framer-motion";

import { guestReservation } from "../../store/thunks/reserveThunk";

export default function ReserveListLoginModal({ modalFlgFasle }) {
  // ===== hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // =============================
  // ||     비회원 예약 조회     ||
  // ===== local states
  const [inputs, setInputs] = useState({
    code: '',
    password: '',
  });

  // ===== 입력 핸들러
  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  // ===== 비회원 예약 조회 버튼
  function handleGuestLookup(e) {
    e.preventDefault();

    if (!inputs.code || !inputs.password) {
      return;
    }

    dispatch(guestReservation(inputs)).unwrap()
      .then(() => {
        modalFlgFasle();
      })
      .catch(err => {
        toast.error('예약 조회에 실패했습니다. 다시 시도해 주세요.')
      })
  }

  // ========================
  // ||     스크롤 방지     ||
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
        className="reserve-list-login-modal-background"
        initial={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
        exit={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
        transition={{ duration: 0.3 }}
      />

      {/* 전체 컨테이너 */}
      <motion.div
        className="reserve-list-login-modal-container"
        initial={{ opacity: 0.9, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0.9, filter: "blur(2px)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="reserve-list-login-modal-x"
          onClick={handleClose}
        >
          <X size={30} />
        </div>

        {/* 페이지 제목 */}
        <div className="reserve-list-login-modal-title-wrapper page-modal-title-wrapper">
          <h2 className="reserve-list-login-modal-title">로그인</h2>
        </div>
        
        {/* 버튼 영역 */}
        <div className="reserve-list-login-modal-btn-container">

          {/* 카카오 버튼 */}
          <button type="button" className="reserve-list-login-modal-kakao-btn-wrapper" onClick={ () => handleSocial('kakao') }>
            <img src={kakaoBtn} alt="카카오 로그인" className="reserve-list-login-modal-kakao-btn" />
            <span className="social-login-page-kakao-text">
              카카오 로그인
            </span>
          </button>

          {/* 비회원 로그인 입력창 */}
          <form onSubmit={handleGuestLookup} className="reserve-list-login-modal-form">
            <div className="reserve-list-login-modal-input-container">
              <input 
                type="text" name="code" 
                className='reserve-list-login-modal-input' 
                placeholder='예약 코드'
                value={inputs.code}
                onChange={handleChange}
              />
              <input 
                type="password" name="password" 
                className='reserve-list-login-modal-input' 
                placeholder='비밀번호' 
                value={inputs.password}
                onChange={handleChange}
              />
            </div>
            {/* 비회원 예약 버튼 */}
            <button type="submit" className="reserve-list-login-modal-guest-btn-wrapper">
              <span className="reserve-list-login-modal-gust-text">
                비회원으로 조회하기
              </span>
            </button>
          </form>
          
        </div>
      </motion.div>
    </>
  )
};