import "./tosspayments/TossPayments.css";
import "./Reserveform.css";
import "./ReserveConfirm.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import CheckoutPage from './tosspayments/TossCheckout.jsx';

export default function ReserveConfirm() {
  // ===== hooks
  const location = useLocation();

  // ===== redux state
  const { deliveryReserve, storageReserve } = useSelector(state => state.reserve)

  // ===== navigate state
  const reserveData = location.state || {};
  const {type, password} = reserveData

  // ===== 데이터 고르기 : 최근 저장 데이터
  const deliveryTime = deliveryReserve?.savedAt ? new Date(deliveryReserve.savedAt).getTime() : 0;
  const storageTime = storageReserve?.savedAt ? new Date(storageReserve.savedAt).getTime() : 0;
  const thisData = (deliveryTime >= storageTime) ? deliveryReserve : storageReserve;

  if (thisData?.type !== type) {
    toast.error('잘못된 접근입니다.')
    // TODO : 뒤로 가는 로직
  }


  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="reserve-form-body">
        {/* 페이지 제목 */}
        <div className="reserve-confirm-title-wrapper page-title-wrapper">
          <h2 className="reserve-confirm-title">결제하기</h2>
        </div>

        <div className="reserve-form-content-container reserve-confirm-content-container">
          <div className="reserve-confirm-content-title">
            <h3 className="reserve-confirm-content-title-h3">
              <span className="reserve-confirm-content-text-pont">{thisData?.userName}</span>
              님의 <span className="reserve-confirm-content-text-pont">{thisData?.type === 'DELIVERY' ? "배송" : "보관"}</span>내용</h3>
          </div>

          <div className="reserve-confirm-content-body">

            <div className="reserve-confirm-content-data-container">

              {/* 이메일 */}
              <div className="reserve-confirm-data-wrapper">
                <span className="reserve-confirm-data-key">이메일</span>
                <span className="reserve-confirm-data-value">{thisData?.email}</span>
              </div>

              {/* 휴대폰 */}
              <div className="reserve-confirm-data-wrapper">
                <span className="reserve-confirm-data-key">휴대폰</span>
                <span className="reserve-confirm-data-value">{thisData?.phone}</span>
              </div>
              {/* 요청사항 */}
              <div className="reserve-confirm-data-wrapper">
                <span className="reserve-confirm-data-key">요청사항</span>
              </div>
              <div className="reserve-confirm-data-value">
                <span>{thisData?.notes}</span>
              </div>

            </div>

            <div className="reserve-confirm-content-data-container">

              {/* 짐 정보 */}
              <div className="reserve-confirm-data-wrapper">
                <span className="reserve-confirm-data-key">보따리</span>
              </div>
              {
                thisData?.luggageList.map((luggage) => (
                  <div className="reserve-confirm-data-value">
                    <span>{luggage.itemType} ({luggage.itemSize}) {luggage.itemWeight} {luggage.count}개</span>
                  </div>
                ))
              }

              {/* ===== 배송 전용 항목 ===== */}
              {thisData?.type === 'DELIVERY' && (
                <>
                  {/* 픽업 일시 */}
                  <div className="reserve-confirm-data-wrapper">
                    <span className="reserve-confirm-data-key">픽업</span>
                  </div>
                  <div className="reserve-confirm-data-value">
                    <span>{thisData?.startedAt && new Date(thisData.startedAt).toLocaleString()}<span className="reserve-confirm-content-gray"></span></span>
                  </div>
                  <div className="reserve-confirm-data-value">
                    <span className="reserve-confirm-content-data">{thisData?.startedAddr}</span>
                  </div>

                  {/* 도착 일시 */}
                  <div className="reserve-confirm-data-wrapper">
                    <span className="reserve-confirm-data-key">도착지</span>
                  </div>
                  <div className="reserve-confirm-data-value">
                    <span className="reserve-confirm-content-data">{thisData?.endedAddr}</span>
                  </div>
                </>
              )}
                  
              {/* ===== 보관 전용 항목 ===== */}
              {thisData?.type === 'STORAGE' && (
                <>

                  {/* 보관 날짜 */}
                  <div className="reserve-confirm-data-wrapper">
                    <span className="reserve-confirm-data-key">보관 기한</span>
                  </div>
                  <div className="reserve-confirm-data-value">
                    <span>{thisData?.startedAt && new Date(thisData.startedAt).toLocaleString()}<span className="reserve-confirm-content-gray"> 부터</span></span>
                  </div>
                  <div className="reserve-confirm-data-value">
                    <span>{thisData?.endedAt && new Date(thisData.endedAt).toLocaleString()}<span className="reserve-confirm-content-gray"> 까지</span></span>
                  </div>

                  {/* 보관소 */}
                  <div className="reserve-confirm-data-wrapper">
                    <span className="reserve-confirm-data-key">보관소</span>
                  </div>
                  <div className="reserve-confirm-data-value">
                    <span>{thisData?.store}<span className="reserve-confirm-content-gray"> 보관소</span></span>
                  </div>

                </>
              )}
            </div>
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="reserve-form-content-container reserve-confirm-content-container">
          <div className="reserve-confirm-content-title">
            <h3 className="reserve-confirm-content-title-h3">결제 금액</h3>
          </div>
          <div className="reserve-confirm-content-data-container">
            <div className="reserve-confirm-data-wrapper">
              <div className="reserve-confirm-data-value reserve-confirm-data-value-point">
                <span className="reserve-confirm-content-data reserve-confirm-content-text-pont">{thisData?.price}<span className="reserve-confirm-content-gray"> 원</span></span>
              </div>
            </div>
          </div>
        </div>



        {/* 결제 버튼 - 토스 */}
        <CheckoutPage payData={thisData} password={password} />

      </div>
    </>
  )
}