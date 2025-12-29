import { useDispatch, useSelector } from "react-redux";
import "./Notice.css";
import { useEffect, useState } from "react";
import { getNoticeThunk } from "../../store/thunks/serviceThunk.js";
import NoticeDetail from "./NoticeDetail.jsx";

export default function Notice() {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux states
  const noticeList = useSelector(state => state.service.noticeList);
  // ===== local states
  const [selectedNotice, setselectedNotice] = useState(null);

  useEffect(() => {
    dispatch(getNoticeThunk());
  }, [])
  // TODO: 백엔드에서 공지사항 목록 가져오기

  return (
    <div className="notice-container">
      {/* 공지사항 목록 */}
      <div className="notice-list">

        {
          noticeList.length > 0 && noticeList.map(notice => (
            <div className="notice-item" key={notice.id}
            onClick={() => setselectedNotice(notice)}
            >
              <div className="notice-item-title">{notice.title}</div>
              <div className="notice-item-date">{notice.createdAt}</div>
            </div>
          ))
        }
        {
          selectedNotice && (
            <NoticeDetail 
              notice={selectedNotice}
              onClose={() => setselectedNotice(null)}
            />
          )
        }

      </div>
    </div>
  );
};