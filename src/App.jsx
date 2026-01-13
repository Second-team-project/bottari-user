import './App.css'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

// 컴포넌트 import
import HeaderWeb from "./components/header/HeaderWeb.jsx";
import HeaderMobile from "./components/header/HeaderMobile.jsx";
import BottomNav from './components/header/BottomNav.jsx';
import ProtectedRouter from './routes/ProtectedRouter.jsx';
import NotificationInfoModal from './components/common/NotificationInfoModal.jsx';
import LiveChatBtn from './components/LiveChat/LiveChatBtn.jsx';

import { getGuideImgThunk } from './store/thunks/guideImgThunk.js';
import Footer from './components/common/Footer.jsx';
import LiveChat from './components/LiveChat/LiveChat.jsx';


function App() {
  // ===== hooks
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getGuideImgThunk())
  }, [])

  return (
    <>
      <div className='app-container'>
        {/* 토스트 */}
        <Toaster position="top-center" offset="80px" />

        {/* 웹용 헤더 */}
        <div className="app-header-web-wrapper">
          <HeaderWeb />
        </div>

        {/* 모바일용 헤더 */}
        <div className="app-header-mobile-wrapper">
          <HeaderMobile />
          <BottomNav />
        </div>

        {/* 프로덱티드 라우터 */}
        <AnimatePresence mode="wait">
          <ProtectedRouter key={location.pathname} />
        </AnimatePresence>

        {/* 알림 권한 유도 모달 */}
        <NotificationInfoModal />
        {/* 채팅 상담 버튼 */}
        <LiveChatBtn />

        {/* 푸터 (채팅 페이지 제외) */}
        {location.pathname !== '/chat' && <Footer />}
      </div>
    </>
  )
}

export default App
