import "./ReserveList.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReserveListLoginModal from "../login/ReserveListLoginModal.jsx";

export default function ReserveList() {
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
      { modalFlg && <ReserveListLoginModal modalFlgFasle={() => setModalFlg(false)} /> }
      {/* 전체 컨테이너 */}
      <div className="reserve-list-container">
        {/* 페이지 제목 */}
        <div className="reserve-list-title-wrapper page-title-wrapper">
          <h2 className="reserve-list-title">내 보따리 확인하기</h2>
        </div>

        {/* 페이지 내용 컨테이너 */}
        <div className="reserve-list-body">

          {/* 예약 아이템1 */}
          <div className="reserve-lsit-content-wrapper">

            {/* 상단 */}
            <div className="reserve-list-content-header">
              {/* 보관/배송 타입 */}
              <div className="reserve-list-type-wrapper">
                <span className="reserve-list-type-ds reserve-list-type-s">보관</span>
              </div>
              {/* 예약/배송/보관/완료/취소 상태 */}
              <div className="reserve-list-type-wrapper">
                <span className="reserve-list-status reserve-list-status-before">예약 중</span>
              </div>
            </div>

            {/* 중간 */}
            <div className="reserve-list-content-middle">
              <div className="reserve-list-location-info">
                <span>동대구역 보관소</span>
              </div>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-date">
              <div className="reserve-list-date-info">
                <span>2025-12-12 09:00 부터</span>
                <span>2025-12-12 21:00 까지</span>
              </div>
            </div>

          </div>

          {/* 예약 아이템2 */}
          <div className="reserve-lsit-content-wrapper">

            {/* 상단 */}
            <div className="reserve-list-content-header">
              {/* 보관/배송 타입 */}
              <div className="reserve-list-type-wrapper">
                <span className="reserve-list-type-ds reserve-list-type-d">배송</span>
              </div>
              {/* 예약/배송/보관/완료/취소 상태 */}
              <div className="reserve-list-type-wrapper">
                <span className="reserve-list-status reserve-list-status-now">배송 중</span>
              </div>
            </div>

            {/* 중간 */}
            <div className="reserve-list-content-middle">
              <div className="reserve-list-location-info">
                <span>수성 호텔 에서</span>
                <span>동대구역 보관소 까지</span>
              </div>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-date">
              <div className="reserve-list-date-info">
                <span>2025-12-12 09:00 부터</span>
                <span>2025-12-12 21:00 까지</span>
              </div>
            </div>

          </div>

          {/* 예약 아이템2 */}
          <div className="reserve-lsit-content-wrapper">

            {/* 상단 */}
            <div className="reserve-list-content-header">
              {/* 보관/배송 타입 */}
              <div className="reserve-list-type-wrapper">
                <span className="reserve-list-type-ds reserve-list-type-d">배송</span>
              </div>
              {/* 예약/배송/보관/완료/취소 상태 */}
              <div className="reserve-list-type-wrapper">
                <span className="reserve-list-status reserve-list-status-done">완료</span>
              </div>
            </div>

            {/* 중간 */}
            <div className="reserve-list-content-middle">
              <div className="reserve-list-location-info">
                <span>수성 호텔 에서</span>
                <span>동대구역 보관소 까지</span>
              </div>
            </div>

            {/* 하단 */}
            <div className="reserve-list-content-date">
              <div className="reserve-list-date-info">
                <span>2025-12-12 09:00 부터</span>
                <span>2025-12-12 21:00 까지</span>
              </div>
            </div>

          </div>




        </div>

      </div>
    </>
  )
};