import { useSelector } from "react-redux";
import "./ReserveList.css";
import ReserveListLoginModal from "../login/reserveListLoginModal.jsx";

export default function ReserveList() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return(
    <>
      { !isLoggedIn && <ReserveListLoginModal /> }
      {/* 전체 컨테이너 */}
      <div className="reserve-list-container">
        {/* 페이지 제목 */}
        <div className="reserve-list-title-wrapper page-title-wrapper">
          <h2 className="reserve-list-title">내 보따리 확인하기</h2>
        </div>
      </div>
    </>
  )
};