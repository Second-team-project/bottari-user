import "./Review.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus } from "lucide-react";
import ReviewDetailModal from "./ReviewDetail.jsx";
import { useDispatch } from "react-redux";
import { getReviewList } from "../../store/thunks/reviewThunk.js";

export default function Review() {
  // ===== hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ===== local states
  const [reviewList, setReviewList] = useState([]);

  // 모달 상태
  const [reviewDetail, setReviewDetail] = useState(null);

  // 별점 렌더링
  // const renderStars = (rating) => {
  //   return Array.from({ length: 5 }, (_, i) => (
  //     <Star
  //       key={i}
  //       size={16}
  //       fill={i < rating ? "#ffc107" : "none"}
  //       color={i < rating ? "#ffc107" : "#ddd"}
  //     />
  //   ));
  // };

  // ===== 데이터 불러오기
  useEffect(() => {
    dispatch(getReviewList({page : 1})).unwrap()
      .then(res => {
        console.log('Review-thunkRes: ', res.data.list)
        setReviewList(res.data.list);
      })
  }, [])



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
          >후기 쓰기</button>
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
                <div className="review-card-image">
                  <img src={review.img} alt="후기 이미지" />
                </div>
              )}

              {/* 카드 내용 */}
              <div className="review-card-content">
                <div className="review-card-header">
                  <span className="review-card-nickname">{review.useId}</span>
                  {/* <div className="review-card-stars">{renderStars(review.rating)}</div> */}
                </div>
                <p className="review-card-text">{review.content}</p>
                <span className="review-card-date">작성일 {review.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 작성 버튼 */}
        <button
          className="review-write-btn"
          onClick={() => navigate("/review/create")}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {reviewDetail && (
          <ReviewDetailModal
            review={reviewDetail}
            onClose={() => setReviewDetail(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};