import "./Review.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus } from "lucide-react";
import ReviewDetailModal from "./ReviewDetail.jsx";

export default function Review() {
  const navigate = useNavigate();

  // 모달 상태
  const [selectedReview, setSelectedReview] = useState(null);

  // TODO: 백엔드에서 후기 목록 가져오기
  const reviews = [
    {
      id: 1,
      nickname: "여행러버",
      rating: 5,
      content: "여행 중 짐 맡기기 너무 편했어요! 직원분도 친절하시고 위치도 좋았습니다.",
      image: null,
      createdAt: "2024.12.25",
    },
    {
      id: 2,
      nickname: "출장족",
      rating: 4,
      content: "공항에서 호텔까지 짐 배송 서비스 이용했는데 정말 편리했습니다. 다음에도 이용할게요!",
      image: "https://via.placeholder.com/300x200",
      createdAt: "2024.12.20",
    },
    {
      id: 3,
      nickname: "김보따리",
      rating: 5,
      content: "보따리 서비스 덕분에 가볍게 여행할 수 있었어요. 강력 추천합니다!",
      image: null,
      createdAt: "2024.12.18",
    },
    {
      id: 4,
      nickname: "힐링여행",
      rating: 5,
      content: "예약도 간편하고 가격도 합리적이에요. 자주 이용할 것 같아요~",
      image: "https://via.placeholder.com/300x200",
      createdAt: "2024.12.15",
    },
  ];

  // 별점 렌더링
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#ffc107" : "none"}
        color={i < rating ? "#ffc107" : "#ddd"}
      />
    ));
  };

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

        {/* 후기 카드 목록 */}
        <div className="review-list">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="review-card"
              onClick={() => setSelectedReview(review)}
            >
              {/* 이미지 (있을 때만) */}
              {review.image && (
                <div className="review-card-image">
                  <img src={review.image} alt="후기 이미지" />
                </div>
              )}

              {/* 카드 내용 */}
              <div className="review-card-content">
                <div className="review-card-header">
                  <span className="review-card-nickname">{review.nickname}</span>
                  <div className="review-card-stars">{renderStars(review.rating)}</div>
                </div>
                <p className="review-card-text">{review.content}</p>
                <span className="review-card-date">{review.createdAt}</span>
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
        {selectedReview && (
          <ReviewDetailModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};