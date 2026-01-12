import "./MainEvent.css";
import banner from "/main.jpg";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MainEvent() {
  // ===== hooks
  const navigate = useNavigate();
  // ===== redux states
  const eventList = useSelector(state => state.guideImg.eventList);
  const loading = useSelector(state => state.guideImg.loading);

  const [currentEvent, setCurrentEvent] = useState(0);

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev === 0 ? eventList.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev === eventList.length - 1 ? 0 : prev + 1));
  };

  // ===== Auto Slide Logic
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // 로딩 중이거나 리스트가 없거나 멈춤 상태면 실행 안 함
    if (loading || !eventList?.length || isPaused) return;

    const timer = setInterval(() => {
      nextEvent();
    }, 4000); // 4초마다 넘어감

    return () => clearInterval(timer);
  }, [isPaused, eventList, loading]); // isPaused가 바뀌면 타이머 재설정

  return (
    
      <div 
        className="main-event-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        <div className="main-event-content">
          <button className="main-event-arrow main-event-arrow-left" onClick={prevEvent}>
            <ChevronLeft size={24} />
          </button>
            <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent}
                  className="main-event-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div 
                    style={{ backgroundImage: `url(${eventList[currentEvent]?.img})` }} 
                    className="main-event-banner-div" 
                    onClick={() => eventList[currentEvent]?.link && navigate(eventList[currentEvent].link)}
                  />
                  {/* <img src={eventList[currentEvent]?.img} alt={`${eventList[currentEvent]?.title}` || '이벤트'} className="main-event-banner" 
                    onClick={() => navigate(`${eventList[currentEvent].link}`)}
                  /> */}
                </motion.div>
            </AnimatePresence>
          <button className="main-event-arrow main-event-arrow-right" onClick={nextEvent}>
            <ChevronRight size={24} />
          </button>
        </div>


        {/* 인디케이터 */}
        <div className="main-event-indicator">
          {eventList.map((_, index) => (
            <span
              key={index}
              className={`${index === currentEvent ? "indicator-dot-active" : "indicator-dot"}`}
              onClick={() => setCurrentEvent(index)}
            />
          ))}
        </div>
      </div>

  );
}