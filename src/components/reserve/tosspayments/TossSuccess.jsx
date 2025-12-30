import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tossPaymentsThunk } from "../../../store/thunks/tossPaymentsThunk.js";
import { useDispatch } from "react-redux";
import { clearReserveSession } from "../../../utils/sessionStorageUtil.js";
import Loading from "../../common/Loading.jsx";
import { toast } from "sonner";

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
        if (error.code === 'ALREADY_PAID') {
          toast.info('이미 처리된 결제입니다.');
          navigate('/');
        } else {
          navigate(`/reserve/tosspayments/fail?message=${error.message}`);
        }  
      }
    }
    confirm();

  }, []);

  return (
    <>
      <Loading text="결제중..."/>
    </>
  );
}