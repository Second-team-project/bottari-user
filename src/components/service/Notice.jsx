import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import "./Notice.css";
import { useEffect, useState } from "react";
import { getNoticeThunk } from "../../store/thunks/serviceThunk.js";
import NoticeDetail from "./NoticeDetail.jsx";

export default function Notice() {
  // ===== hooks
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  // ===== redux states
  const { noticeList, noticeListCount } = useSelector(state => state.service);
  // ===== local states
  const [selectedNotice, setselectedNotice] = useState(null);

  console.log('noticeList.length / noticeListCount: ', noticeList.length, noticeListCount)

  // ===== 첫 호출 : 마운트 - 공지사항 목록 가져오기
  useEffect(() => {
    dispatch(getNoticeThunk());
  }, [dispatch]);

  // === 더보기 호출
  const loadMore = async () => {
    const nextPage = page + 1;
    await dispatch(getNoticeThunk(nextPage));
    setPage(nextPage);
  }

  // ===== URL 파라미터로 모달 자동 오픈
  useEffect(() => {
    const noticeId = searchParams.get('id');
    if (noticeId && noticeList?.length > 0) {
      const found = noticeList.find(n => n.id === Number(noticeId));
      if (found) {
        setselectedNotice(found);
      }
    }
  }, [searchParams, noticeList]);

  // ===== 공지사항 클릭 핸들러
  const handleNoticeClick = (notice) => {
    setselectedNotice(notice);
    setSearchParams({ id: notice.id });
  };

  // ===== 모달 닫기 핸들러
  const handleCloseModal = () => {
    setselectedNotice(null);
    setSearchParams({});
  };

  console.log('Notice: ', noticeList)

  return (
    <div className="notice-container">
      {/* 공지사항 목록 */}
      <div className="notice-list">

        {
          noticeList?.length > 0 && noticeList.map(notice => (
            <div className="notice-item" key={notice.id}
              onClick={() => handleNoticeClick(notice)}
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
              onClose={handleCloseModal}
            />
          )
        }
        {
          noticeList?.length < noticeListCount && (
            <div className="service-more-btn-wrapper">
              <button type="button" className="service-more-btn"
                onClick={loadMore}
              >더 보기</button>
            </div>
          )
        }

      </div>
    </div>
  );
};