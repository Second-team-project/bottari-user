import { useEffect } from "react";
import "./NoticeDetail.css";
import { X } from "lucide-react";
import dayjs from "dayjs";

export default function NoticeDetail({ notice, onClose }) {

  // ========================
  // ||     스크롤 방지     ||
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return(
    <>
      {/* 불투명 배경 */}
      <div className="notice-detail-background" onClick={onClose}></div>

      {/* 전체 컨테이너 */}
      <div className="notice-detail-container">

        {/* 닫기 버튼 */}
        <div className="notice-detail-x"
          onClick={onClose}
        >
          <X size={30} />
        </div>

        {/* 페이지 제목 */}
        <div className="-notice-detail-title-wrapper page-modal-title-wrapper">
          <h2 className="notice-detail-title">{notice.title}</h2>
        </div>

        <div className="notice-detail-header-wrapper">
          {
            notice.createdAt === notice.updatedAt ? (
              <span className="notice-datail-date-text">{dayjs(notice.createdAt).format('YYYY-MM-DD HH:mm')} 작성</span>
            ) : (
              <span className="notice-datail-date-text">{dayjs(notice.updatedAt).format('YYYY-MM-DD HH:mm')} 수정</span>
            )
          }
        </div>

        <hr className="notice-detail-line" />



        {/* 내용 */}
        <div className="notice-detail-content-container">
          <div className="notice-detail-content-wrapper">
            <p className="notice-detail-content-text">{notice.content}</p>
          </div>
        </div>


      </div>
    </>
  )
};