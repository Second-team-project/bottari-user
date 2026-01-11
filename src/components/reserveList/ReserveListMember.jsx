import "./ReserveList.css";
import "./ReserveListMember.css";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { userReservation } from "../../store/thunks/reserveThunk.js";

import ReserveItem from "./ReserveItem.jsx";
import Loading from "../common/Loading.jsx";
import { useNavigate } from "react-router-dom";

export default function ReserveListMemeber() {
  // ===== hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ===== redux states
  const user = useSelector(state => state.auth.user)
  const { reservationList, loading, reservationListCount } = useSelector(state => state.reserve);
  // ===== local states
  const [page, setPage] = useState(1);
  const lastPage = Math.ceil(reservationListCount / 10) || 1;

  // ===== 유저 조회
  useEffect(() => {
    if(user) {
      dispatch(userReservation({ page: 1 }))
    }
  }, [user, dispatch])

  // 추가 페이지 불러오기
  const loadMore = () => {
    const nextPage = page + 1;
    dispatch(userReservation({ page: nextPage }));
    setPage(nextPage);
  }

  return(
    <div className="reserve-list-body">
      {/* 로딩중 */}
      {
        loading && (
          <div className="reserve-list-noItem">
            <Loading fullScreen={false} text="불러오는 중..."/>
          </div>
        )
      }
      {/* 예약 아이템이 없는 경우 */}
      {
        !loading && reservationList?.length === 0 &&
        <div className="reserve-list-noItem">
          <Loading fullScreen={false} text="예약 내역이 없습니다."/>
          <div className="reserve-list-noItem-btn-wrapper">
            <button className="reserve-list-noItem-btn" onClick={() => navigate('/reserve')}>예약 하러가기</button>
          </div>
        </div>
      }

      {/* 예약 아이템이 있는 경우 */}
      {
        reservationList?.length >= 1 && (
          <>
            {
              reservationList?.map((item, index) => (
                <motion.div
                  key={item.code}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ReserveItem data={item} />
                </motion.div>
              ))
            }
            {
              reservationList?.length < reservationListCount && (
                <div className="reserve-list-more-btn-wrapper">
                  <button type="button" className="reserve-list-more-btn"
                    onClick={loadMore}
                  >더 보기</button>
                </div>
              )
            }
          </>
        )
      }
    </div>
  )
}
