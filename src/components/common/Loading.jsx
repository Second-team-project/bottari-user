import "./Loading.css";
import BottariIcon from "../logo/BottariIcon.jsx";

export default function Loading({ text = "로딩중...", size = 80, fullScreen = true }) {
  // 전체 화면 (기본값) - 페이지 로딩
  // <Loading />

  // 인라인 - 모달, 버튼 안에서
  // <Loading fullScreen={false} size={40} text="취소 중..." />
  return (
    <div className={`loading-container ${fullScreen ? '' : 'loading-inline'}`}>
      <div className="loading-icon-wrapper loading-bounce">
        <BottariIcon width={size} height={size} />
        <BottariIcon width={size} height={size} />
        <BottariIcon width={size} height={size} />
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
}
