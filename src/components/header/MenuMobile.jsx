/**
 * @file client/src/components/header/MenuMobile.jsx
 * @description 모바일용 메뉴 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./MenuMobile.css";
import { AnimatePresence, motion } from "motion/react"

// 아이콘 import
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MenuMobile({ menuFlgFalse }) {
  // ===== hook
  const navigate = useNavigate();


  return (
    <>
      {/* 블러 배경 */}
      <motion.div className="menu-mobile-blur-background" onClick={menuFlgFalse} 
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
          <div className="menu-mobile-x-wrapper" onClick={menuFlgFalse}>
            <X size={35}/>
          </div>
        </div>

        {/* 메뉴 부분 */}
        <div className="menu-mobile-list-container">
          <div className="menu-mobile-list-item" onClick={ () => { navigate('/guide/usage'); menuFlgFalse(); }}>
            <h3>이용안내</h3>
          </div>
          <div className="menu-mobile-list-item" onClick={ () => { navigate('/guide/price'); menuFlgFalse(); }}>
            <h3>요금안내</h3>
          </div>
          <br />
          <div className="menu-mobile-list-item" onClick={ () => { navigate('/reserve'); menuFlgFalse(); }}>
            <h3>예약</h3>
          </div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding" onClick={ () => { navigate('/reserve/delivery'); menuFlgFalse(); }}>
            <h3>보따리 옮기기</h3>
          </div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding" onClick={ () => { navigate('/reserve/storage'); menuFlgFalse(); }}>
            <h3>보따리 맡기기</h3>
          </div>
          <br />
          <div className="menu-mobile-list-item" onClick={ () => { navigate('/reserve/list'); menuFlgFalse(); }}>
            <h3>내 보따리 확인하기</h3>
          </div>
          <br />
          <div className="menu-mobile-list-item" onClick={ () => { navigate('/review'); menuFlgFalse(); }}>
            <h3>보따리 후기</h3>
          </div>
          <br />
          <div className="menu-mobile-list-item" onClick={ () => { navigate('/service'); menuFlgFalse(); }}>
            <h3>고객센터</h3>
          </div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding" onClick={ () => { navigate('/service/notice'); menuFlgFalse(); }}>
            <h3>공지사항</h3>
          </div>
          <div className="menu-mobile-list-item menu-mobile-list-item-padding" onClick={ () => { navigate('/service/faq'); menuFlgFalse(); }}>
            <h3>자주 묻는 질문</h3>
          </div>
        </div>
      </motion.div>
    </>
  )
}