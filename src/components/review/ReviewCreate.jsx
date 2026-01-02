import "./ReviewCreate.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, ChevronDown, ChevronUp } from "lucide-react";

import { getReviewable, createReview } from "../../store/thunks/reviewThunk";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function ReviewCreate() {
  // ===== hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ===== local states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // 예약 선택 관련 states
  const [reservations, setReservations] = useState([]);
  const [selectedReserv, setSelectedReserv] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ===== 예약 정보 가져오기
  useEffect(() => {
    dispatch(getReviewable()).unwrap()
      .then(res => {
        // console.log('res', res.data)
        if(res.data && Array.isArray(res.data)) {
          setReservations(res.data);
        }
      })
      .catch(err => {
        console.error('리뷰 작성 가능한 예약을 가져오지 못했습니다.', err)
      })
  }, [dispatch]);

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 이미지 삭제
  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  // 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedReserv) {
      toast.error("후기를 작성할 이용 내역을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    const payload = {
      reservId: selectedReserv.id,
      title: title,
      content: content,
      img: image, // 진짜 파일 데이터
    };

    console.log({ 
      reservId: selectedReserv.id,
      title, 
      content, 
      image 
    });

    dispatch(createReview(payload))
      .unwrap()
      .then(() => {
        toast.success("리뷰가 등록되었습니다!");
        navigate("/review"); // 목록 페이지로 이동
      })
      .catch((err) => {
        console.error("등록 실패:", err);
        toast.error("리뷰 등록에 실패했습니다.");
      })
  };

  // 날짜 포맷팅 함수 (예: 2025.01.01)
  const formatDate = (dateString) => {
    if(!dateString) return '';
    return dayjs(dateString).format('YYYY.MM.DD');
  }

  // 서비스 타입 추출 함수
  const getServiceType = (code) => {
    if (code?.startsWith('D')) return '[배송]';
    if (code?.startsWith('S')) return '[보관]';
    return '[기타]';
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 전체 컨테이너 */}
      <div className="review-create-container">
        {/* 페이지 제목 */}
        <div className="review-create-title-wrapper page-title-wrapper">
          <h2 className="review-create-title">후기 작성하기</h2>
        </div>

        <form className="review-create-form" onSubmit={handleSubmit}>

          {/* 예약 선택 (드롭다운) */}
          <div className="review-create-section">
            <label className="review-create-label">이용 내역 선택</label>
            <span className="review-small-notice-text">이용이 완료된 예약만 후기를 작성할 수 있습니다.</span>
            
            {/* 선택 박스 */}
            <div 
              className={`review-reserv-select-box ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedReserv ? (
                <div className="reserv-info-selected">
                  <span className="reserv-type-badge">{getServiceType(selectedReserv.code)}</span>
                  <span className="reserv-date-text">{formatDate(selectedReserv.createdAt)}</span>
                  <span className="reserv-code-text">{selectedReserv.code}</span>
                </div>
              ) : (
                <span className="placeholder">
                  {reservations.length > 0 
                    ? "후기를 작성할 이용 내역을 선택해주세요" 
                    : "작성 가능한 이용 내역이 없습니다"}
                </span>
              )}
              {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {/* 드롭다운 리스트 */}
            <AnimatePresence>
              {isDropdownOpen && reservations.length > 0 && (
                <motion.div 
                  className="review-reserv-list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {reservations.map(reserv => (
                    <div 
                      key={reserv.id} 
                      className={`review-reserv-item ${selectedReserv?.id === reserv.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedReserv(reserv);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="reserv-item-header">
                        <span className="reserv-item-type">{getServiceType(reserv.code)}</span>
                        <span className="reserv-item-date">{formatDate(reserv.createdAt)}</span>
                      </div>
                      <div className="reserv-item-body">
                        <span className="reserv-item-code">{reserv.code}</span>
                        <span className="reserv-item-price">{Number(reserv.price).toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 제목 */}
          <div className="review-create-section">
            <label className="review-create-label">제목</label>
            <input
              className="review-create-textarea"
              placeholder="제목을 작성해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div className="review-create-section">
            <label className="review-create-label">내용</label>
            <textarea
              className="review-create-textarea"
              placeholder="서비스 이용 후기를 작성해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

          {/* 이미지 첨부 */}
          <div className="review-create-section">
            <label className="review-create-label">사진 ( 선택 )</label>
            <span className="review-small-notice-text">사진은 최대 1장 업로드 가능합니다.</span>

            {
              imagePreview ? (
                <div className="review-create-image-preview">
                  <img src={imagePreview} alt="미리보기" />
                  <button
                    type="button"
                    className="review-create-image-remove"
                    onClick={handleImageRemove}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="review-create-image-upload">
                  <ImagePlus size={32} />
                  <span>사진 추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              )
            }
          </div>

          {/* 버튼 */}
          <div className="review-create-buttons">
            <button
              type="button"
              className="review-create-btn cancel"
              onClick={() => navigate("/review")}
            >
              취소
            </button>
            <button
              type="submit"
              className="review-create-btn submit"
              disabled={!title.trim() || !content.trim() || !selectedReserv}
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};