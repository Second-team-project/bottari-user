import "./Reserve.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReserveLoginModal from "../login/ReserveLoginModal.jsx";
import BottariIcon from "../logo/BottariIcon.jsx";

export default function Reserve() {
  const navigate = useNavigate()

  // ===== 전역 state
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  // ===== 로컬 state
  const [modalFlg, setModalFlg] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setModalFlg(true);
    }    
  }, [])

  return(
    <>
      { modalFlg && <ReserveLoginModal modalFlgFasle={() => setModalFlg(false)} /> }
      {/* 전체 컨테이너 */}
      <div className="reserve-page-container">
        {/* 페이지 제목 */}
        <div className="reserve-title-wrapper page-title-wrapper">
          <h2 className="reserve-title">예약</h2>
        </div>

        {/* 버튼 영역 */}
        <div className="reserve-btn-container" >
          {/* 맡기기 버튼 */}
          <div className="reserve-btn-style reserve-btn-storage" onClick={ () => { navigate('/reserve/storage') }}>
            <BottariIcon className="reserve-btn-icon-style" />
            <p className="reserve-btn-text">
              맡기기
            </p>
          </div>
          {/* 옮기기 버튼 */}
          <div className="reserve-btn-style reserve-btn-delivery" onClick={ () => { navigate('/reserve/delivery') }}>
            <BottariIcon className="reserve-btn-icon-style" />
            <p className="reserve-btn-text">
              옮기기
            </p>
          </div>


        </div>

      </div>

    
    </>
  )
}