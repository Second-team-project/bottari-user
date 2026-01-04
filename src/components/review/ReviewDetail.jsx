import "./ReviewDetail.css";

import { motion } from "framer-motion";
import { X, Star, Trash2, ImageOff } from "lucide-react";

import { maskEmail } from "../../utils/maskEmail.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ReviewDeleteCheck from "./ReviewDeleteCheck.jsx";

export default function ReviewDetailModal({ review, onClose, onDeleteSuccess }) {
  // ===== redux states
  const user = useSelector(state => state.auth.user);
  // ===== local states
  const [deleteFlg, setDeleteFlg] = useState(false);

  // console.log('user.id: ', user.id, 'review.writer.id: ', review.writer.userId)

  // ========================
  // ||     스크롤 방지     ||
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

      {
        deleteFlg && (
          <ReviewDeleteCheck 
            onClose={() => setDeleteFlg(false)}
            reviewId={review.id} 
            onDeleteSuccess={() => {
              onClose();
              if(onDeleteSuccess) onDeleteSuccess(review.id);
            }}
          />
        )
      }

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
        {
          review.img ? (
            <div className="review-modal-image">
              <img src={review.img} alt="후기 이미지" />
            </div>
          ) : (
            <div className="review-modal-image">
              <span className="review-font-color-gray review-margin-right"><ImageOff /></span>
              <span className="review-font-color-gray">등록된 이미지가 없습니다.</span>
            </div>

          )
        }

        {/* 내용 */}
        <div className="review-detail-container">

          <div className="review-modal-header">
            <span className="review-modal-title">{review?.title}</span>
            {
              user?.id === review?.writer.userId && (
                <button type="button" className="review-detail-tresh"
                  onClick={() => setDeleteFlg(true)}
                ><Trash2 size={24} /></button>
              )
            }
          </div>

          <p className="review-modal-text">{review?.content}</p>

          <div className="review-card-bottom">
            <span>작성일: {review?.createdAt}</span>
            <span>작성자: {maskEmail(review.writer?.email)}</span>
          </div>

        </div>


      </motion.div>
    </>
  );
};