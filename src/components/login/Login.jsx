import "./Login.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

export default function Login() {
  return(
    <>
      <div className="login-container">
        <p className="login-text">로그인 하시면 예약 관리가 더 쉬워져요!</p>
        <button type="button" className="login-social-kakao-btn">
          <img src={kakaoBtn} alt="카카오 로그인" className="login-kakao-btn" />
          <span className="login-kakao-text">
            카카오 로그인
          </span>
        </button>
      </div>
    </>
  )
}