import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import "./ReserveListGuest.css";
import ReserveItem from "./ReserveItem";

export default function ReserveListGuest() {
  const reservation = useSelector(state => state.reserve.reservation);

  console.log('비회원 예약 정보: ', reservation)
  return(
    <div className="reserve-list-body">
      {
        reservation &&
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReserveItem data={reservation}/>
        </motion.div>
      }
    </div>
  )
}