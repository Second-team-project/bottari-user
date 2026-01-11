import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ReserveListGuest.css";
import ReserveItem from "./ReserveItem";
import Loading from "../common/Loading.jsx";

export default function ReserveListGuest() {
  const navigate = useNavigate();
  const reservation = useSelector(state => state.reserve.reservation);

  // PENDING_PAYMENT 제외한 유효한 예약인지 확인
  const isValidReservation = reservation && reservation.state !== 'PENDING_PAYMENT';

  console.log('비회원 예약 정보: ', reservation)
  return(
    <div className="reserve-list-body">
      {/* 유효한 예약이 없는 경우 */}
      {
        !isValidReservation && (
          <div className="reserve-list-noItem">
            <Loading fullScreen={false} text="조회된 예약이 없습니다."/>
            <div className="reserve-list-noItem-btn-wrapper">
              <button className="reserve-list-noItem-btn" onClick={() => navigate('/reserve')}>예약 하러가기</button>
            </div>
          </div>
        )
      }
      {/* 유효한 예약이 있는 경우 */}
      {
        isValidReservation && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReserveItem data={reservation}/>
          </motion.div>
        )
      }
    </div>
  )
}