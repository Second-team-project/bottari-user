import "./ReviewCreate.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";

export default function ReviewCreate() {
  const navigate = useNavigate();

  // ===== local states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
    // TODO: 백엔드로 후기 전송
    console.log({ content, image });
    navigate("/review");
  };

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
              disabled={!title.trim() || !content.trim()}
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};