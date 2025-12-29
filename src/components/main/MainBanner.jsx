import "./MainBanner.css";
import banner from "/main.jpg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MainBanner() {
  // TODO: 백엔드에서 배너 가져오기


  return (

      <div className="main-banner-container">
        <div className="main-banner" style={{ backgroundImage: `url(${banner})` }}></div>
        배너입니다.
      </div>

  );
}