/**
 * @file client/src/components/header/HeaderWeb.jsx
 * @description 웹용 상단 헤더 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./HeaderWeb.css";
import { useNavigate } from "react-router-dom";

import BottariLogo2 from "../logo/BottariLogo2.jsx";

// 아이콘 import
import { User, Globe } from 'lucide-react';

export default function HeaderWeb() {
  const navigate = useNavigate()

  


  return(
    <>
      <div className="header-web-container">

        {/* 왼쪽 영역 */}
        <div className="header-web-left-container">
          <div className="header-web-logo-wrapper header-web-click-effect" onClick={() => {navigate('/')}} >
            <BottariLogo2 width={135} height={75}/>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="header-web-right-container">


          {/* 메뉴 영역 */}
          <div className="header-web-menu-container">


            <div className="header-web-menu-item header-web-click-effect" onClick={() => {navigate('/guide/usage')}}>
              <h3>이용</h3>
            </div>

            <div className="header-web-menu-item header-web-click-effect" onClick={() => {navigate('/guide/price')}}>
              <h3>요금</h3>
            </div>

            <div className="header-web-menu-item header-web-menu-drop">
              <div className="header-web-click-effect" onClick={() => {navigate('/reserve')}}>
                <h3>예약</h3>
              </div>
              {/* 드랍다운 메뉴 */} 
              <div className="header-web-menu-drop-container">
                <div className="header-web-menu-drop-item header-web-click-effect" onClick={() => {navigate('/reserve/storage')}}>
                  <h3>맡기기</h3>
                </div>
                <div className="header-web-menu-drop-item header-web-click-effect" onClick={() => {navigate('/reserve/delivery')}}>
                  <h3>옮기기</h3>
                </div>
              </div>
            </div>

            <div className="header-web-menu-item header-web-click-effect" onClick={() => {navigate('/reserve/list')}}>
              <h3>조회</h3>
            </div>

            <div className="header-web-menu-item header-web-click-effect" onClick={() => {navigate('/review')}}>
              <h3>후기</h3>
            </div>

            <div className="header-web-menu-item header-web-menu-drop">
              <div className="header-web-click-effect" onClick={() => {navigate('/service')}}>
                <h3>고객센터</h3>
              </div>
              {/* 드랍다운 메뉴 */} 
              <div className="header-web-menu-drop-container">
                <div className="header-web-menu-drop-item header-web-click-effect" onClick={() => {navigate('/service/notice')}}>
                  <h3>공지사항</h3>
                </div>
                <div className="header-web-menu-drop-item header-web-click-effect" onClick={() => {navigate('/service/faq')}}>
                  <h3>자주 묻는 질문</h3>
                </div>
              </div>
            </div>

            {/* 아이콘 영역 */}
            <div className="header-web-icon-container">
              <div className="header-web-icon-wrapper header-web-click-effect">
                <span className="header-web-icon-text">한국어</span>
                <Globe size={20} />
              </div>
              <div className="header-web-icon-wrapper header-web-click-effect" onClick={() => {navigate('/login')}}>
                <span className="header-web-icon-text">로그인</span>
                <User size={20} />
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  )
};