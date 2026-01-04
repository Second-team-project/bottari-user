import './NotificationInfoModal.css';

import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import usePushNotifications from '../../hooks/usePushNotifications.jsx';

export default function NotificationInfoModal() {
  const { isInit, isSubscribing, isCheckedSubscribe, subscribeUser, dismissModal } = usePushNotifications();
  const { isLoggedIn } = useSelector(state => state.auth);

  console.log('알림 권한 요청 모달: ', { isLoggedIn, isInit, isSubscribing, isCheckedSubscribe });

  return (
    <>
      {
        ( isLoggedIn && isInit && !isSubscribing && !isCheckedSubscribe) && (
          <motion.div
            className="notification-info-container"
            initial={{ opacity: 0.9, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0.9, filter: "blur(2px)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="notification-info-x-wrapper">
              <button type="button" className="notification-info-x" onClick={dismissModal}>
                <X size={24} />
              </button>
            </div>

            <div className="notification-info-title-wrapper">
              <span className="notification-info-title">알림을 받아보시겠습니까?</span>
            </div>

            <div className="notification-info-content">
              <p>알림을 허용하시면 서비스 안내 알림을 받을 수 있습니다.</p>
              <p>서비스 안내 내용 : 보관 완료 안내, 배송 기사 배정 안내, 배송 단계 변경, </p>
            </div>

            <div className="notification-info-btn-wrapper">
              <button type="button" className="notification-info-btn" onClick={dismissModal}>취소</button>
              <button type="button" className="notification-info-btn notification-info-btn-navy" onClick={subscribeUser}>허용</button>
            </div>
          </motion.div>
        )
      }
    </>
  )
}