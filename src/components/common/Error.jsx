import "./Error.css";
import BottariIcon from "../logo/BottariIcon.jsx";

export default function Error({ text = "오류가 발생했습니다" }) {
  return (
    <div className="error-container">
      <div className="error-icon-wrapper error-shake">
        <BottariIcon width={80} height={80} mood="dead" />
        <BottariIcon width={80} height={80} mood="dead" />
        <BottariIcon width={80} height={80} mood="dead" />
      </div>
      <span className="error-text">{text}</span>
    </div>
  )
}
