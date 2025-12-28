import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tossPaymentsThunk } from "../../../store/thunks/tossPaymentsThunk.js";
import { useDispatch } from "react-redux";
import { clearReserveSession } from "../../../utils/sessionStorageUtil.js";

export default function TossSuccessPage() {
  // ===== hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. 결제 데이터 정의
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    const confirm = async() => {
      try {
        // 서버로 결제 승인 요청 보냄
        const response = await dispatch(tossPaymentsThunk(requestData)).unwrap();
        // 결제 성공 시 sessionStorage 정리
        clearReserveSession();
        navigate(`/reserve/complete/${response.data.orderId}`)
      
      } catch (error) {
        navigate(`/reserve/tosspayments/fail?message=${error.message}`);
        
      }
    }
    confirm();

    // async function confirm(requestData) {
    //   const response = await fetch("/confirm", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(requestData),
    //   });

    //   const json = await response.json();

    //   if (!response.ok) {
    //     // 결제 실패 비즈니스 로직을 구현하세요.
    //     navigate(`/fail?message=${json.message}&code=${json.code}`);
    //     return;
    //   }

    //   // 결제 성공 비즈니스 로직을 구현하세요.
    // }
    // confirm();

  }, []);

  return (
    <div className="result toss-wrapper">
      <div className="toss-box-section">
        <h2>
          결제 성공
        </h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get("amount")
        ).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
      </div>
    </div>
  );
}