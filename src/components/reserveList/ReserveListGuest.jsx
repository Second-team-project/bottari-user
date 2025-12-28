import { useSelector } from "react-redux";
import "./ReserveListGuest.css";
import ReserveItem from "./ReserveItem";

export default function ReserveListGuest() {
  const reservation = useSelector(state => state.reserve.reservation);



  console.log('비회원 예약 정보: ', reservation)
  return(
    <div className="reserve-list-body">
      {
        reservation &&
        <ReserveItem data={reservation}/>
      }
    </div>
  )
}