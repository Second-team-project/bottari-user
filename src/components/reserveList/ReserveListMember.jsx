import "./ReserveList.css";
import "./ReserveListMember.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { userReservation } from "../../store/thunks/reserveThunk.js";

import ReserveItem from "./ReserveItem.jsx";

export default function ReserveListMemeber() {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux states
  const user = useSelector(state => state.auth.user)
  const reservationList = useSelector(state => state.reserve.reservationList);

  // ===== 유저 조회
    useEffect(() => {
      if(user) {
        dispatch(userReservation())
      }
    }, [user, dispatch])
  
    console.log('예약조회-reservationList: ', reservationList)



  return(
    <div className="reserve-list-body">
      {/* 예약 아이템이 없는 경우 */}
      {
        reservationList.length === 0 &&
        <div className="reserve-list-noItem">
          예약 내역이 없습니다.
        </div>
      }

      {/* 예약 아이템이 있는 경우 */}
      {
        reservationList.length >= 1 && reservationList.filter(item => item.state !== 'PENDING_PAYMENT') // 결제 대기 제외
          .map((item, index) => (
            <motion.div
              key={item.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ReserveItem data={item} />
            </motion.div>
          )
        )
      }
    </div>
  )
}
