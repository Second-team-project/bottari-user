import "./ReserveList.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import ReserveListLoginModal from "../login/ReserveListLoginModal.jsx";
import ReserveListMember from "./ReserveListMember.jsx";
import ReserveListGuest from "./ReserveListGuest.jsx";

import { userReservation } from "../../store/thunks/reserveThunk.js";
import { setLoading } from "../../store/slices/authSlice.js";

export default function ReserveList() {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux states
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const loading = useSelector(state => state.auth.loading);
  // ===== local state
  // === 로그인 모달
  const [modalFlg, setModalFlg] = useState(false)

  // ===== 로그인 모달
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setModalFlg(true);
    } else {
      setModalFlg(false);
    }
  }, [isLoggedIn, loading])

  return(
    <>
      <AnimatePresence>
        { modalFlg && <ReserveListLoginModal modalFlgFasle={() => setModalFlg(false)} /> }
      </AnimatePresence>
      {/* 전체 컨테이너 */}
      <div className="reserve-list-container">
        {/* 페이지 제목 */}
        <div className="reserve-list-title-wrapper page-title-wrapper">
          <h2 className="reserve-list-title">내 보따리 확인하기</h2>
        </div>

        {
          isLoggedIn &&
          <ReserveListMember />
        }

        {
          !isLoggedIn &&
          <ReserveListGuest />
        }

      </div>
    </>
  )
};