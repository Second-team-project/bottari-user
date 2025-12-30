import "./ReserveList.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ReserveListLoginModal from "../login/ReserveListLoginModal.jsx";
import ReserveListMember from "./ReserveListMember.jsx";
import ReserveListGuest from "./ReserveListGuest.jsx";

export default function ReserveList() {
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
      <motion.div
        className="reserve-list-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
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

      </motion.div>
    </>
  )
};