/**
 * @file client/src/components/header/MenuMobile.jsx
 * @description 모바일용 메뉴 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./MenuMobile.css";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react"

import { setMenuFlg } from "../../store/slices/menuSlice";

// 아이콘 import
import { X } from "lucide-react";

export default function MenuMobile() {
  const dispatch = useDispatch()
  const menuFlg = useSelector(state => state.menu.menuFlg);

  function handleMenu() {
    dispatch(setMenuFlg(false))
  }

  return(
    <>
      {/* 블러 배경 */}
      <motion.div className="menu-mobile-blur-background" onClick={handleMenu} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      />

      {/* 메뉴 영역 */}
      <motion.div className="menu-mobile-container"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, type: "tween" }}
      >

        {/* 상단 부분 */}
        <div className="menu-mobile-top">
          <div className="menu-mobile-x-wrapper" onClick={handleMenu}>
            <X size={35}/>
          </div>
        </div>

        {/* 메뉴 부분 */}
        <div className="menu-mobile-list-container">
          <div className="menu-mobile-list-item"><h3>이용안내</h3></div>
          <div className="menu-mobile-list-item"><h3>요금안내</h3></div>
          <br />
          <div className="menu-mobile-list-item"><h3>예약</h3></div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding"><h3>보따리 옮기기</h3></div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding"><h3>보따리 맡기기</h3></div>
          <br />
          <div className="menu-mobile-list-item"><h3>내 보따리 확인하기</h3></div>
          <br />
          <div className="menu-mobile-list-item"><h3>보따리 후기</h3></div>
          <br />
          <div className="menu-mobile-list-item"><h3>고객센터</h3></div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding"><h3>공지사항</h3></div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding"><h3>자주 묻는 질문</h3></div>
        </div>
      </motion.div>
    </>
  )
}