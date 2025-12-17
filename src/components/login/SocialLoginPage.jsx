import "./SocialLoginPage.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

export default function Login() {
  return(
    <>
    <div className="social-login-page-container">

      <div className="social-login-page-btn-container">
        <p className="social-login-page-text">로그인 하시면 예약 관리가 더 쉬워져요!</p>
        <button type="button" className="social-login-page-kakao-btn-wrapper">
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