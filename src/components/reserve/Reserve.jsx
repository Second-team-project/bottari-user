import "./Reserve.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReserveLoginModal from "../login/ReserveLoginModal.jsx";
import BottariIcon from "../logo/BottariIcon.jsx";

export default function Reserve() {
  const navigate = useNavigate()

  // ===== 전역 state
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  // ===== 로컬 state
  const [modalFlg, setModalFlg] = useState(false)

  // ===== 로그인 모달 플래그
  useEffect(() => {
    if (!isLoggedIn) {
      setModalFlg(true);
    }    
  }, [])

  return(
    <>
      <AnimatePresence>
        { modalFlg && <ReserveLoginModal modalFlgFasle={() => setModalFlg(false)} /> }
      </AnimatePresence>
      {/* 전체 컨테이너 */}
      <motion.div
        className="reserve-page-container"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* 페이지 제목 */}
        <div className="reserve-title-wrapper page-title-wrapper">
          <h2 className="reserve-title">예약</h2>
        </div>

        {/* 버튼 영역 */}
        <div className="reserve-btn-container" >
          {/* 맡기기 버튼 */}
          <motion.div
            className="reserve-btn-style reserve-btn-storage"
            onClick={ () => { navigate('/reserve/storage') }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <BottariIcon className="reserve-btn-icon-style" />
            <p className="reserve-btn-text">
              맡기기
            </p>
          </motion.div>
          {/* 옮기기 버튼 */}
          <motion.div
            className="reserve-btn-style reserve-btn-delivery"
            onClick={ () => { navigate('/reserve/delivery') }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <BottariIcon className="reserve-btn-icon-style" />
            <p className="reserve-btn-text">
              옮기기
            </p>
          </motion.div>


        </div>

      </motion.div>

    
    </>
  )
}