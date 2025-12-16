/**
 * @file client/src/components/header/BottomNav.jsx
 * @description 모바일용 하단 네비이션 컴포넌트
 * 251213 v1.0.0 N init
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import "./BottomNav.css";

import BottariIcon from "../logo/BottariIcon.jsx";

// 아이콘 import
import { User, Languages, Menu } from 'lucide-react';

export default function BottomNav() {
  const menus = ['홈', '예약', '조회', '요금'];
  const [clickedMenu, setClickedMenu] = useState(null);

  const handleMenuClick = (index) => {
    setClickedMenu(index);
  };

  return(
    <>
      <div className="bottom-nav-container">
        {menus.map((menu, index) => (
          <React.Fragment key={index}>
            <div
              className={`bottom-nav-icon bottom-nav-click-effect ${clickedMenu === index ? 'menu-relative' : ''}`}
              onClick={() => handleMenuClick(index)}
            >
              <h3>{menu}</h3>
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