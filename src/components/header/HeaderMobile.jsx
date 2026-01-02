/**
 * @file client/src/components/header/HeaderMobile.jsx
 * @description 모바일용 상단 헤더 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./HeaderMobile.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react"
import { toast } from "sonner";

import BottariLogo2 from "../logo/BottariLogo2.jsx";
import MenuMobile from "./MenuMobile.jsx";
import { logoutThunk } from "../../store/thunks/authThunk.js";

// 아이콘 import
import { User, UserRound, Globe, Menu, LogOut } from 'lucide-react';
import { span } from "motion/react-client";


export default function HeaderMobile() {
  // ===== hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ===== redux state
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  // ===== local state
  const [menuFlg, setMenuFlg] = useState(false)

  // ===========================================================
  // ||     화면 크기가 769px 이상이 되면 메뉴 자동으로 닫기     ||
  // ===========================================================
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');

    const handleResize = (e) => {
      if (e.matches && menuFlg) {
        setMenuFlg(false);
      }
    };

    // 초기 체크
    if (mediaQuery.matches && menuFlg) {
      setMenuFlg(false);
    }

    // 리스너 추가
    mediaQuery.addEventListener('change', handleResize);

    // 클린업
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [menuFlg]);

  // ============================
  // ||     로그인 로그아웃     ||
  // ============================
  const handleAccount = () => {
    if(isLoggedIn) {
      dispatch(logoutThunk()).unwrap()
        .then(() => {
          toast.success('로그아웃 되었습니다.');
          navigate("/");
        })
        .catch((error) => {
          toast.error("로그아웃 중 오류가 발생했습니다.")
        })
    } else {
      navigate("/login");
    }
  }

  return(
    <>
      <div className="header-mobile-menu">
        <AnimatePresence>
          { menuFlg && <MenuMobile menuFlgFalse={() => setMenuFlg(false) } /> }
        </AnimatePresence>
      </div>
      
      <div className="header-mobile-container">

        {/* 왼쪽 영역 : 메뉴 */}
        <div className="header-mobile-left-container">
          <div className="header-mobile-menu-wrapper" onClick={() => setMenuFlg(true)}>
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
          {/* <div className="header-mobile-icon-wrapper">
            <Globe size={20} />
          </div> */}
          <div className="header-mobile-icon-wrapper" onClick={() => handleAccount()}>
            {
              isLoggedIn 
              ? (
                <>
                  <span className="header-web-icon-text">로그아웃</span>
                  <LogOut size={24} />
                </>
              ) : (
                <>
                  <span className="header-web-icon-text">로그인</span>
                  <UserRound size={24} />
                </>
              ) 
            }
            
          </div>
        </div>

      </div>
    </>
  )
};