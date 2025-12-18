import { useNavigate } from "react-router-dom";
import "./Reserve.css";
import { useSelector } from "react-redux";
import ReserveLoginModal from "../login/ReserveLoginModal.jsx";

export default function Reserve() {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  function navReserveDelivery() {
    navigate('/Reserve/delivery');
  }
  function navReserveStorage() {
    navigate('/Reserve/storage');
  }


  return(
    <>
      {!isLoggedIn && <ReserveLoginModal /> }
      {/* 전체 컨테이너 */}
      <div className="reserve-page-container">
        {/* 페이지 제목 */}
        <div className="reserve-title-wrapper page-title-wrapper">
          <h2 className="reserve-title">예약</h2>
        </div>

        {/* 버튼 영역 */}
        <div className="reserve-btn-container" >
          {/* 맡기기 버튼 */}
          <div className="reserve-btn-style reserve-btn-storage reserve-btn-style-blue" onClick={navReserveStorage}>
            <p className="reserve-btn-text">
              맡기기
            </p>
          </div>
          {/* 옮기기 버튼 */}
          <div className="reserve-btn-style reserve-btn-delivery reserve-btn-style-pink" onClick={navReserveDelivery}>
            <p className="reserve-btn-text">
              옮기기
            </p>
          </div>


        </div>

      </div>

    
    </>
  )
}