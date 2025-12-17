/**
 * @file client/src/components/header/HeaderMobile.jsx
 * @description 모바일용 상단 헤더 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./HeaderMobile.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react"

import BottariLogo2 from "../logo/BottariLogo2.jsx";
import MenuMobile from "./MenuMobile.jsx";

import { setMenuFlg } from "../../store/slices/menuSlice.js";

// 아이콘 import
import { User, UserRound, Globe, Menu, LogOut } from 'lucide-react';


export default function HeaderMobile() {
  // ===== hook
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // ===== 전역 state
  const menuFlg = useSelector(state => state.menu.menuFlg);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)


  function handleMenu() {
    dispatch(setMenuFlg(true))
  }

  // 화면 크기가 769px 이상이 되면 메뉴 자동으로 닫기
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');

    const handleResize = (e) => {
      if (e.matches && menuFlg) {
        dispatch(setMenuFlg(false));
      }
    };

    // 초기 체크
    if (mediaQuery.matches && menuFlg) {
      dispatch(setMenuFlg(false));
    }

    // 리스너 추가
    mediaQuery.addEventListener('change', handleResize);

    // 클린업
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [dispatch, menuFlg]);

  console.log('모바일 메뉴🚩 ', menuFlg);

  return(
    <>
      <div className="header-mobile-menu">
        <AnimatePresence>
          { menuFlg && <MenuMobile /> }
        </AnimatePresence>
      </div>
      
      <div className="header-mobile-container">

        {/* 왼쪽 영역 : 메뉴 */}
        <div className="header-mobile-left-container">
          <div className="header-mobile-menu-wrapper" onClick={handleMenu}>
            <Menu size={30} />
          </div>
        </div>

        {/* 가운데 영역 : 로고 */}
        <div className="header-mobile-middle-container">
          <div className="header-mobile-logo-wrapper" onClick={() => { navigate('/') }}>
            <BottariLogo2 width = {135}  height = {75} />
          </div>
        </div>

        {/* 오른쪽 영역 : 아이콘 */}
        <div className="header-mobile-right-container">
          <div className="header-mobile-icon-wrapper">
            {/* <span className="header-mobile-icon-text">한국어</span> */}
            <Globe size={20} />
          </div>
          <div className="header-mobile-icon-wrapper" onClick={() => { navigate('/login') }}>
            {/* <span className="header-mobile-icon-text">로그인</span> */}
            {
              isLoggedIn 
              ? <LogOut size={24} />
              : <UserRound size={24} />
            }
            
          </div>
        </div>

      </div>
    </>
  )
};