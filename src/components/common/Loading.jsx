import "./Loading.css";
import BottariIcon from "../logo/BottariIcon.jsx";

export default function Loading({ text = "로딩중..." }) {
  return (
    <div className="loading-container">
      <div className="loading-icon-wrapper loading-bounce">
        <BottariIcon width={80} height={80} />
        <BottariIcon width={80} height={80} />
        <BottariIcon width={80} height={80} />
      </div>
      <span className="loading-text">{text}</span>
    </div>
  )
}
