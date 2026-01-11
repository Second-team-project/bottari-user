import "./Service.css";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Service() {
  const location = useLocation();
  const navigate = useNavigate();

  // ===== 스크롤 top 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    { id: "notice", path: "/service/notice", label: "공지사항" },
    { id: "faq", path: "/service/faq", label: "자주 묻는 질문" },
  ];

  // 현재 경로로 활성 탭 판별
  const getActiveTab = () => {
    if (location.pathname.startsWith("/service/faq")) return "faq";
    return "notice"; // 기본값
  };

  const activeTab = getActiveTab();

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      {/* 전체 컨테이너 */}
      <div className="service-container">
        {/* 페이지 제목 */}
        <div className="service-title-wrapper page-title-wrapper">
          <h2 className="service-title">고객센터</h2>
        </div>

        {/* 폴더 탭 UI */}
        <div className="service-tab-wrapper">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`service-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* 탭 콘텐츠 영역 - 자식 라우트 렌더링 */}
        <div className="service-content">
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
};