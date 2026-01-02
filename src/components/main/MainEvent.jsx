import "./MainEvent.css";
import banner from "/main.jpg";
import { useState } from "react";
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

  console.log('loading:', loading, 'eventList:', eventList);


  return (
    
      <div className="main-event-container">

        <div className="main-event-content">
          <button className="main-event-arrow left" onClick={prevEvent}>
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
                  <img src={eventList[currentEvent]?.img} alt={`${eventList[currentEvent]?.title}` || '이벤트'} className="main-event-banner" 
                    onClick={() => navigate(`${eventList[currentEvent].link}`)}
                  />
                </motion.div>
            </AnimatePresence>
          <button className="main-event-arrow right" onClick={nextEvent}>
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