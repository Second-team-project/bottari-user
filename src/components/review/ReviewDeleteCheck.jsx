import "./ReviewDeleteCheck.css";

import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

import { destroyReview } from "../../store/thunks/reviewThunk.js";

export default function ReviewDeleteCheck({ onClose, reviewId, onDeleteSuccess }) {
  // ===== hooks
  const dispatch = useDispatch();

  function handleDelete() {
    dispatch(destroyReview(reviewId)).unwrap()
      .then(() => {
        toast.success('후기가 삭제되었습니다.');
        onClose();

        if(onDeleteSuccess) {
          onDeleteSuccess(reviewId);
        }
      })
      .catch(err => {
        toast.error('삭제에 실패했습니다. 새로고침 후 다시 시도해 주세요.');
        console.error(err);
      });
  }

  return (
    <>

      {/* 전체 컨테이너 */}
      <motion.div
        className="review-delete-modal-container"
        initial={{ opacity: 0.9, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0.9, filter: "blur(2px)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="review-delete-modal-x-wrapper">
        <button type="button" className="review-delete-modal-x" 
          onClick={onClose}
        ><X size={24} /></button>
        </div>

        {/* 페이지 제목 */}
        <div className="review-delete-title-wrapper page-modal-title-wrapper">
          <span className="review-delete-title">삭제하시겠습니까?</span>
        </div>

        <div className="review-delete-btn-wrapper">
          <button type="button" className="reveiw-delete-btn" onClick={onClose}>취소</button>
          <button type="button" className="reveiw-delete-btn reveiw-delete-btn-navy"
            onClick={handleDelete}
          >삭제</button>
        </div>

      </motion.div>
    </>
  )
}