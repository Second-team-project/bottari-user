import "./ReviewDetail.css";
import { motion } from "framer-motion";
import { X, Star } from "lucide-react";

export default function ReviewDetailModal({ review, onClose }) {
  // 별점 렌더링
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < rating ? "#ffc107" : "none"}
        color={i < rating ? "#ffc107" : "#ddd"}
      />
    ));
  };

  return (
    <>
      {/* 배경 */}
      <motion.div
        className="review-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* 모달 */}
      <motion.div
        className="review-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* 닫기 버튼 */}
        <button className="review-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* 이미지 */}
        {review.image && (
          <div className="review-modal-image">
            <img src={review.image} alt="후기 이미지" />
          </div>
        )}

        {/* 내용 */}
        <div className="review-modal-content">
          <div className="review-modal-header">
            <span className="review-modal-nickname">{review.nickname}</span>
            <div className="review-modal-stars">{renderStars(review.rating)}</div>
          </div>
          <p className="review-modal-text">{review.content}</p>
          <span className="review-modal-date">{review.createdAt}</span>
        </div>
      </motion.div>
    </>
  );
};