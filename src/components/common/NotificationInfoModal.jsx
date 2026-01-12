import './NotificationInfoModal.css';

import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import usePushNotifications from '../../hooks/usePushNotifications.jsx';
import { useEffect } from 'react';

export default function NotificationInfoModal() {
  const { isInit, isSubscribing, isCheckedSubscribe, subscribeUser, dismissModal, dismissToday } = usePushNotifications();
  const { isLoggedIn } = useSelector(state => state.auth);

  // ========================
  // ||     스크롤 방지     ||
  useEffect(() => {
    const shouldShow = isLoggedIn && isInit && !isSubscribing && !isCheckedSubscribe;

    if (shouldShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoggedIn, isInit, isSubscribing, isCheckedSubscribe]);

  return (
    <>
      {
        ( isLoggedIn && isInit && !isSubscribing && !isCheckedSubscribe ) && (
          // 불투명 배경
          <>
          <motion.div
            className="reserve-list-login-modal-background"
            initial={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
            exit={{ opacity: 0.8, backdropFilter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="notification-info-container"
            initial={{ opacity: 0.9, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0.9, filter: "blur(2px)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="notification-info-header">
              <span className="notification-info-title">서비스 이용 알림</span>
              <button type="button" className="notification-info-x">
                <X size={24}  onClick={dismissModal} />
              </button>
            </div>

            <div className="notification-info-content">
              <p>알림을 허용하시면 서비스 안내 알림을 받을 수 있습니다.</p>
              <br />
              <p className='notification-info-content-bold'>제공 알림 : </p>
              <p className='notification-info-content-bold'>예약 일정 시작 및 완료, 배송 기사 배정 및 배송 단계 변경</p>
            </div>

            <div className="notification-check-wrapper">
              <label className="notification-check-label" onClick={dismissToday}>
                <input type="checkbox" className="notification-check-input" readOnly />
                <span className="notification-check-text" >오늘 하루 보지 않기</span>
              </label>
            </div>

            <div className="notification-info-btn-wrapper">
              <button type="button" className="notification-info-btn" onClick={dismissModal}>나중에 하기</button>
              <button type="button" className="notification-info-btn notification-info-btn-navy" onClick={subscribeUser}>알림 받기</button>
            </div>
          </motion.div>
          </>
        )
      }
    </>
  )
}