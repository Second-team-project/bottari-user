import "./Review.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus } from "lucide-react";

import { getReviewList } from "../../store/thunks/reviewThunk.js";
import { maskEmail } from "../../utils/maskEmail.js";

import ReviewDetailModal from "./ReviewDetail.jsx";
import { toast } from "sonner";

export default function Review() {
  // ===== hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ===== local states
  const [reviewList, setReviewList] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [page, setPage] = useState(1);
  // 모달 상태
  const [reviewDetail, setReviewDetail] = useState(null);

  // ===== 데이터 불러오기
  useEffect(() => {
    dispatch(getReviewList({ page: 1 })).unwrap()
      .then(res => {
        setReviewList(res.list);
        setReviewCount(res.count);
      })
      .catch(err => {
        console.error('리뷰 목록 조회 실패: ', err);
        toast.error('알 수 없는 오류가 발생했습니다. 새로고침 해주세요.');
      })
  }, [dispatch])

  // ===== 핸들러
  // 리뷰 삭제 시 목록에서 제거
  function handleDeleteReview(reviewId) {
    setReviewList(prev => prev.filter(item => item.id !== reviewId));
    setReviewCount(prev => prev - 1);
  }

  // 더보기
  function handleMore() {
    const nextPage = page + 1;
    dispatch(getReviewList({ page: nextPage })).unwrap()
      .then(res => {
        setReviewList(prev => [...prev, ...res.list]);
        setPage(nextPage);
      })
      .catch(err => {
        console.error('리뷰 더보기 실패: ', err);
      })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 전체 컨테이너 */}
      <div className="review-container">
        {/* 페이지 제목 */}
        <div className="review-title-wrapper page-title-wrapper">
          <h2 className="review-title">후기</h2>
        </div>

        <div className="review-btn-wrapper">
          <button
            className="review-btn"
            onClick={() => navigate("/review/create")}
          >후기 작성하기</button>
        </div>

        {/* 후기 카드 목록 */}
        <div className="review-list">
          {reviewList?.map((review) => (
            <div
              key={review.id}
              className="review-card"
              onClick={() => setReviewDetail(review)}
            >
              {/* 이미지 (있을 때만) */}
              {review.img && (
                <div className="review-card-image-wrapper">
                  <div className="review-card-image" style={{backgroundImage: `url('${review?.img}')`}}  />
                  {/* src={review?.img} */}
                </div>
              )}

              {/* 카드 내용 */}
              <div className="review-card-content">

                <div className="review-card-header">
                  <span className="review-card-title">{review?.title}</span>
                </div>

                <p className="review-card-text">{review?.content}</p>

                <div className="review-card-bottom">
                  <span>작성일: {review?.createdAt}</span>
                  <span>작성자: {maskEmail(review.writer?.email)}</span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {
          reviewList.length < reviewCount && (
            <div className="review-more-btn-wrapper">
              <button type="button" className="review-more-btn"
                onClick={handleMore}
              >더 보기</button>
            </div>
          )
        }

      </div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {reviewDetail && (
          <ReviewDetailModal
            review={reviewDetail}
            onClose={() => setReviewDetail(null)}
            onDeleteSuccess={handleDeleteReview}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};