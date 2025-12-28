import "./Notice.css";

export default function Notice() {
  // TODO: 백엔드에서 공지사항 목록 가져오기

  return (
    <div className="notice-container">
      {/* 공지사항 목록 */}
      <div className="notice-list">
        {/* 임시 데이터 */}
        <div className="notice-item">
          <div className="notice-item-title">서비스 오픈 안내</div>
          <div className="notice-item-date">2024.12.25</div>
        </div>
        <div className="notice-item">
          <div className="notice-item-title">연말 운영 시간 변경 안내</div>
          <div className="notice-item-date">2024.12.20</div>
        </div>
        <div className="notice-item">
          <div className="notice-item-title">보따리 서비스 이용 가이드</div>
          <div className="notice-item-date">2024.12.15</div>
        </div>
      </div>
    </div>
  );
};