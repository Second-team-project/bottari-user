/**
 * @file client/src/components/header/BottomNav.jsx
 * @description 모바일용 하단 네비이션 컴포넌트
 * 251213 v1.0.0 N init
 */

import "./BottomNav.css";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";

import BottariIcon from "../logo/BottariIcon.jsx";


export default function BottomNav() {
  // ===== hook
  const navigate = useNavigate();
  const location = useLocation();

  // ======================================
  // ||     보따리 떨어지는 애니메이션     ||
  const [clickedMenu, setClickedMenu] = useState(null);
  const menus = [
    { label: `홈`, path: '/'},
    { label: `예약`, path: '/reserve'},
    { label: `조회`, path: '/reserve/list'},
    { label: `요금`, path: '/guide'},
  ];

  // 경로 변경 감지해서 활성 메뉴 설정
  useEffect(() => {
    const currentPath = location.pathname;

    // 가장 길게 매칭되는 경로 찾기 (더 구체적인 경로 우선)
    let matchedIndex = -1;
    let longestMatch = 0;

    menus.forEach((menu, index) => {
      if (menu.path === '/' && currentPath === '/') {
        matchedIndex = index;
        longestMatch = 1;
      } else if (menu.path !== '/' && currentPath.startsWith(menu.path)) {
        if (menu.path.length > longestMatch) {
          longestMatch = menu.path.length;
          matchedIndex = index;
        }
      }
    });

    if (matchedIndex !== -1 && matchedIndex !== clickedMenu) {
      setClickedMenu(matchedIndex);
    }
  }, [location.pathname]);

  const handleMenuClick = (index, path) => {
    setClickedMenu(index);  // 애니메이션 인덱스
    navigate(path);  // 내비게이션 path
  };

  return(
    <>
      <div className="bottom-nav-container">

        {/* 애니메이션 작동 인덱스 */}
        {menus.map((menu, index) => (
          <React.Fragment key={index}>
            <div
              className={`bottom-nav-icon bottom-nav-click-effect ${clickedMenu === index ? 'menu-relative' : ''}`}
              onClick={() => handleMenuClick(index, menu.path)}
            >
              <h3>{menu.label}</h3>
              {clickedMenu === index && (
                <motion.div
                  className="bottari-drop"
                  key={`mascot-${index}`}  // 메뉴 바뀔 때 애니메이션 재실행
                  initial={{ y: -60, opacity: 0, rotate: -15 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,   // 탄성 강도
                    damping: 30,      // 얼마나 빨리 멈추나
                    mass: 2           // 무게감
                  }}
                >
                  <BottariIcon width={50} height={70} />
                </motion.div>
              )}
            </div>
            {index < menus.length - 1 && <div className="bottom-nav-divider"></div>}
          </React.Fragment>
        ))}

      </div>
    </>
  )
}