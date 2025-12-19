/**
 * @file src/components/login/SocialLoginPage.jsx
 * @description 소설 로그인 페이지
 * 20251217 v1.0.0 N init
 */

import "./SocialLoginPage.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

export default function Login() {

  // =============================
  // ||     소셜 로그인 요청     ||
  function handleSocial(provider) {
    window.location.replace(`${import.meta.env.VITE_SERVER_URL}/api/user/auth/social/${provider}`)
  }

  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="social-login-page-container">
        {/* 페이지 제목 */}
        <div className="social-login-page-title-wrapper page-title-wrapper">
          <h2 className="social-login-page-title">로그인</h2>
        </div>
        {/* 유도 문구 */}
        <div className="social-login-page-text-warpper page-title-wrapper">
          <p className="social-login-page-text">로그인 하시면 예약 관리가 더 쉬워져요!</p>
        </div>

        {/* 버튼 영역 */}
        <div className="social-login-page-btn-container">
          <button type="button" className="social-login-page-kakao-btn-wrapper" onClick={ () => handleSocial('kakao') }>
            <img src={kakaoBtn} alt="카카오 로그인" className="social-login-page-kakao-btn" />
            <span className="social-login-page-kakao-text">
              카카오 로그인
            </span>
          </button>
        </div>
      </div>
    </>
  )
}