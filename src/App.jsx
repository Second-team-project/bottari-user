import './App.css'

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import axiosIns from './api/axiosInstance.js';

// 컴포넌트 import
import HeaderWeb from "./components/header/HeaderWeb.jsx";
import HeaderMobile from "./components/header/HeaderMobile.jsx";
import BottomNav from './components/header/BottomNav.jsx';

function App() {

  // 백엔드 연결 테스트
  useEffect(() => {
    console.log('API URL:', import.meta.env.VITE_SERVER_URL);
    const test = async () => {
      const res = await axiosIns.get('/api/test/success');
      console.log(res.data);
    };
    test();
  }, []);

  return (
    <>
      <div className='app-container'>
        {/* 웹용 헤더 */}
        <div className="app-header-web-wrapper">
          <HeaderWeb />
        </div>
        {/* 모바일용 헤더 */}
        <div className="app-header-mobile-wrapper">
          <HeaderMobile />
          <BottomNav />
        </div>
        
        <Outlet />
      </div>
    </>
  )
}

export default App
