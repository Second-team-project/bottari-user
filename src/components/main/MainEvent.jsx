import "./MainEvent.css";
import banner from "/main.jpg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MainEvent() {
  // TODO: 백엔드에서 이벤트 목록 가져오기
  const [currentEvent, setCurrentEvent] = useState(0);
  const events = [
    { id: 1, title: "신규 가입 이벤트", description: "첫 예약 시 10% 할인!" },
    { id: 2, title: "연말 특별 이벤트", description: "12월 한정 무료 보관 1시간 추가" },
    { id: 3, title: "친구 초대 이벤트", description: "친구 초대 시 적립금 지급" },
  ];

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  return (

      <div className="main-event-container">
        <button className="main-event-arrow left" onClick={prevEvent}>
          <ChevronLeft size={24} />
        </button>

        <div className="main-event-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent}
              className="main-event-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="main-event-title">{events[currentEvent].title}</h3>
              <p className="main-event-desc">{events[currentEvent].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button className="main-event-arrow right" onClick={nextEvent}>
          <ChevronRight size={24} />
        </button>

        {/* 인디케이터 */}
        <div className="main-event-indicator">
          {events.map((_, index) => (
            <span
              key={index}
              className={`indicator-dot ${index === currentEvent ? "active" : ""}`}
              onClick={() => setCurrentEvent(index)}
            />
          ))}
        </div>
      </div>

  );
}