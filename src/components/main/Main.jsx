import "./Main.css";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import MainBanner from "./MainBanner.jsx";
import MainEvent from "./MainEvent.jsx";
import MainService from "./MainSevice.jsx";

export default function Main() {
  // ===== 스크롤 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* 메인 배너 */}
      <MainBanner />

      {/* 이벤트 슬라이더 */}
      <MainEvent />

      {/* 서비스 소개 */}
      <MainService />

    </motion.div>
  );
}