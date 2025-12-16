/**
 * @file client/src/components/header/HeaderWeb.jsx
 * @description 웹용 상단 헤더 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./HeaderWeb.css";

import BottariLogo2 from "../logo/BottariLogo2.jsx";

// 아이콘 import
import { User, Globe } from 'lucide-react';

export default function HeaderWeb() {

  return(
    <>
      <div className="header-web-container">

        {/* 왼쪽 영역 */}
        <div className="header-web-left-container">
          <div className="header-web-logo-wrapper header-web-click-effect">
            <BottariLogo2 width={135} height={75}/>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="header-web-right-container">

          {/* 아이콘 영역 */}
          <div className="header-web-icon-container">
            <div className="header-web-icon-wrapper header-web-click-effect">
              <span className="header-web-icon-text">한국어</span>
              <Globe size={20} />
            </div>
            <div className="header-web-icon-wrapper header-web-click-effect">
              <span className="header-web-icon-text">로그인</span>
              <User size={20} />
            </div>
          </div>

          {/* 메뉴 영역 */}
          <div className="header-web-menu-container">
            <div className="header-web-menu-item header-web-click-effect">
              <h3>이용</h3>
            </div>
            <div className="header-web-menu-item header-web-click-effect">
              <h3>요금</h3>
            </div>
            <div className="header-web-menu-item header-web-menu-drop">
              <div className="header-web-click-effect">
                <h3>예약</h3>
              </div>
              {/* 드랍다운 메뉴 */} 
              <div className="header-web-menu-drop-container">
                <div className="header-web-menu-drop-item header-web-click-effect">
                  <h3>맡기기</h3>
                </div>
                <div className="header-web-menu-drop-item header-web-click-effect">
                  <h3>옮기기</h3>
                </div>
              </div>
            </div>
            <div className="header-web-menu-item header-web-click-effect">
              <h3>조회</h3>
            </div>
            <div className="header-web-menu-item header-web-click-effect">
              <h3>후기</h3>
            </div>
            <div className="header-web-menu-item header-web-menu-drop">
              <div className="header-web-click-effect">
                <h3>고객센터</h3>
              </div>
              {/* 드랍다운 메뉴 */} 
              <div className="header-web-menu-drop-container">
                <div className="header-web-menu-drop-item header-web-click-effect">
                  <h3>공지사항</h3>
                </div>
                <div className="header-web-menu-drop-item header-web-click-effect">
                  <h3>자주 묻는 질문</h3>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  )
};