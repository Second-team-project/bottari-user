import "./ReserveListLoginModal.css";
import kakaoBtn from "../../assets/kakao_login_large_narrow.png";

export default function ReserveListLoginModal({ modalFlgFasle }) {

  // 소셜 로그인 요청
  function handleSocial(provider) {
    window.location.replace(`${import.meta.env.VITE_SERVER_URL}/api/user/auth/social/${provider}`)
  }

  return(
    <>
      {/* 불투명 배경 */}
      <div className="reserve-list-login-modal-background" onClick={modalFlgFasle}></div>

      {/* 전체 컨테이너 */}
      <div className="reserve-list-login-modal-container">

        {/* 페이지 제목 */}
        {/* <div className="reserve-list-login-modal-title-wrapper page-title-wrapper">
          <h2 className="reserve-list-login-modal-title">로그인</h2>
        </div> */}

        {/* 유도 문구 */}
        <div className="reserve-list-login-modal-text-warpper page-title-wrapper">
          <p className="reserve-list-login-modal-text reserve-list-login-modal-text-web">로그인 하시면 예약 관리가 더 쉬워져요!</p>
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
          <div className="reserve-list-login-modal-input-container">
            <input 
              type="text" className='reserve-list-login-modal-input' placeholder='예약 코드'
            />
            <input 
              type="password" className='reserve-list-login-modal-input' placeholder='비밀번호' 
            />
          </div>
          {/* 비회원 예약 버튼 */}
          <button type="button" className="reserve-list-login-modal-guest-btn-wrapper">
            <span className="reserve-list-login-modal-gust-text">
              비회원으로 조회하기
            </span>
          </button>
          
        </div>


      </div>
    </>
  )
};