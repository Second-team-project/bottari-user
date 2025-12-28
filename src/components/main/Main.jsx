import "./Main.css";
import banner from "/main.jpg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Main() {
  // TODO: 백엔드에서 이벤트 목록 가져오기
  const [currentEvent, setCurrentEvent] = useState(0);
  const events = [
    { id: 1, title: "신규 가입 이벤트", description: "첫 예약 시 10% 할인!" },
    { id: 2, title: "연말 특별 이벤트", description: "12월 한정 무료 보관 1시간 추가" },
    { id: 3, title: "친구 초대 이벤트", description: "친구 초대 시 적립금 지급" },
  ];

  // TODO: 백엔드에서 서비스 설명 이미지 가져오기
  const serviceInfos = [
    { id: 1, title: "맡기기", description: "여행 중 짐을 안전하게 보관하세요" },
    { id: 2, title: "옮기기", description: "원하는 장소로 짐을 배송해드려요" },
    { id: 3, title: "간편 예약", description: "몇 번의 터치로 간편하게 예약" },
  ];

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* 메인 배너 */}
      <div className="main-banner-container">
        <div className="main-banner" style={{ backgroundImage: `url(${banner})` }}></div>
      </div>

      {/* 이벤트 슬라이더 */}
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

      {/* 서비스 소개 */}
      <div className="main-service-container">
        <h2 className="main-service-title">보따리 서비스</h2>
        <div className="main-service-list">
          {serviceInfos.map((info) => (
            <div key={info.id} className="main-service-item">
              <div className="main-service-image">
                {/* TODO: 백엔드에서 이미지 가져오기 */}
                <span>{info.title}</span>
              </div>
              <h3>{info.title}</h3>
              <p>{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}