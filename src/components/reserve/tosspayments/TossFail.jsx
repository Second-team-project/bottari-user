import "./TossPayments.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottariIcon from "../../logo/BottariIcon.jsx";

export default function TossFailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div className="toss-fail-container">
      {/* 보따리 아이콘 */}
      <div className="toss-fail-icon-wrapper">
        <BottariIcon width={70} height={70} mood="dead" />
        <BottariIcon width={70} height={70} mood="dead" />
        <BottariIcon width={70} height={70} mood="dead" />
      </div>

      {/* 안내 문구 */}
      <div className="toss-fail-text-wrapper">
        <h2 className="toss-fail-title">결제에 실패했습니다</h2>
        <p className="toss-fail-message">{searchParams.get("code") || ""}</p>
        <p className="toss-fail-message">{searchParams.get("message") || "알 수 없는 오류가 발생했습니다"}</p>
      </div>

      {/* 버튼 */}
      <div className="toss-fail-btn-wrapper">
        <button className="toss-fail-btn" onClick={() => navigate('/', { replace: true })}>메인으로</button>
        <button className="toss-fail-btn toss-fail-btn-primary" onClick={() => navigate('/reserve', { replace: true })}>다시 예약하기</button>
      </div>
    </div>
  );
}