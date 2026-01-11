import "./tosspayments/TossPayments.css";
import "./Reserveform.css";
import "./ReserveConfirm.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";

import CheckoutPage from './tosspayments/TossCheckout.jsx';
import { getReserveSession } from "../../utils/sessionStorageUtil.js";
import { setDeliveryReserve, setStorageReserve } from "../../store/slices/reserveSlice.js";
import dayjs, { Dayjs } from "dayjs";
import { ArrowBigDown } from "lucide-react";

export default function ReserveConfirm() {
  // ===== hooks
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===== 스크롤 top 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===== redux state
  const { deliveryReserve, storageReserve } = useSelector(state => state.reserve)

  // ===== navigate state (새로고침 시 없을 수 있음)
  const reserveData = location.state || {};

  // ===== sessionStorage에서 복구 시도
  const sessionData = getReserveSession();

  // ===== 데이터 결정: Redux > sessionStorage
  const type = reserveData.type || sessionData?.type;
  const password = reserveData.password; // password는 sessionStorage에 저장 안함 (보안)

  // Redux에서 데이터 가져오기
  const deliveryTime = deliveryReserve?.savedAt ? new Date(deliveryReserve.savedAt).getTime() : 0;
  const storageTime = storageReserve?.savedAt ? new Date(storageReserve.savedAt).getTime() : 0;
  let thisData = (deliveryTime >= storageTime) ? deliveryReserve : storageReserve;

  // Redux에 없으면 sessionStorage에서 복구
  if (!thisData && sessionData?.data) {
    thisData = sessionData.data;
    // Redux에도 복구해두기
    if (sessionData.type === 'DELIVERY') {
      dispatch(setDeliveryReserve(sessionData.data));
    } else if (sessionData.type === 'STORAGE') {
      dispatch(setStorageReserve(sessionData.data));
    }
  }

  // ===== 데이터 유효성 검사 및 리다이렉트
  useEffect(() => {
    // 1. 데이터가 없거나 타입이 맞지 않으면 리다이렉트
    if (!thisData || thisData.type !== type) {
      toast.error('오류가 발생했습니다. 다시 예약해주세요.');
      navigate(-1, { replace: true });
      return;
    }
    // 2. 비회원인데 비밀번호가 없으면 리다이렉트 (새로고침으로 날아간 경우)
    if (thisData.userType === 'GUEST' && !password) {
      toast.error('비밀번호 정보가 없습니다. 다시 입력해주세요.');
      navigate(-1, { replace: true });
    }
  }, [thisData, type, password, navigate]);

  // 데이터가 없거나 비회원인데 비밀번호가 없으면 렌더링하지 않음
  if (!thisData || thisData.type !== type) {
    return null;
  }
  if (thisData.userType === 'GUEST' && !password) {
    return null;
  }


  return(
    <>
      {/* 전체 컨테이너 */}
      <motion.div
        className="reserve-form-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 페이지 제목 */}
        <div className="reserve-confirm-title-wrapper page-title-wrapper">
          <h2 className="reserve-confirm-title">결제하기</h2>
          {/* 비회원 새로고침 주의 문구 */}
          {thisData.userType === 'GUEST' && (
            <p className="reserve-confirm-notice">* 내용 확인 후 결제를 진행해 주세요.</p>
          )}
        </div>

        <div className="reserve-form-content-container reserve-confirm-content-container">
          <div className="reserve-confirm-content-title">
            <span className="border-bottom-var-bottari-pink font-size-1-3-rem">{thisData?.userName}</span>
            <span> 님의 </span>
            <span className="border-bottom-var-bottari-pink font-size-1-3-rem">{thisData?.type === 'DELIVERY' ? "배송" : "보관"}</span>
            <span> 내용 </span>
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
                <span className="reserve-confirm-data-value">{thisData?.phone || '미입력'}</span>
              </div>
              {/* 요청사항 */}
              <div className="reserve-confirm-data-wrapper">
                <span className="reserve-confirm-data-key">요청사항</span>
                <span className="reserve-confirm-data-value">{thisData?.notes || '없음'}</span>
              </div>

              {/* 짐 정보 */}
              <div className="reserve-confirm-data-wrapper">
                <span className="reserve-confirm-data-key">보따리</span>
                <div className="reserve-confirm-data-value-wrapper">
                {
                  thisData?.luggageList.map((luggage, index) => (
                    <div key={index}>
                      <span>{luggage.itemType} {luggage.itemSize ? `( ${luggage.itemSize} )` : ''} {luggage.itemWeight} {luggage.count}개</span>
                    </div>
                  ))
                }
                </div>
              </div>

            </div>



            


            {/* ===== 배송 전용 항목 ===== */}
            {thisData?.type === 'DELIVERY' && (
              <div className="reserve-confirm-content-data-container-middle">

                {/* 픽업 일시 */}
                <div className="reserve-confirm-data-wrapper border-none padding-bottom-0">
                  <span className="reserve-confirm-data-key">픽업</span>
                  <div className="reserve-confirm-data-value-wrapper">
                    <span>{thisData?.startedAt && dayjs(thisData.startedAt).format('MM월 DD일 ddd HH시 mm분')}</span>
                    <span className="reserve-confirm-content-data">
                      {thisData?.startedAddr?.addr}
                      {thisData?.startedAddr?.addrDetail && ` ${thisData.startedAddr.addrDetail}`}
                    </span>
                    <span className="reserve-confirm-content-gray"><ArrowBigDown /><span className="reserve-confirm-margin-right-4-rem">{'   '}</span></span>
                  </div>
                </div>

                {/* 도착지 */}
                <div className="reserve-confirm-data-wrapper padding-top-0">
                  <span className="reserve-confirm-data-key">도착지</span>
                  <div className="reserve-confirm-data-value-wrapper">
                    <span className="reserve-confirm-content-data">
                      {thisData?.endedAddr?.addr}
                      {thisData?.endedAddr?.addrDetail && ` ${thisData.endedAddr.addrDetail}`}
                    </span>
                  </div>
                </div>

              </div>
            )}
                  
            {/* ===== 보관 전용 항목 ===== */}
            {thisData?.type === 'STORAGE' && (
              <div className="reserve-confirm-content-data-container-middle">

                {/* 보관 날짜 */}
                <div className="reserve-confirm-data-wrapper">
                  <span className="reserve-confirm-data-key">보관 기한</span>
                  <div className="reserve-confirm-data-value-wrapper">
                    <span>{thisData?.startedAt && dayjs(thisData.startedAt).format('MM월 DD일  HH시 mm분')}</span>
                    <span className="reserve-confirm-content-gray"><ArrowBigDown /><span className="reserve-confirm-margin-right-4-rem">{'   '}</span></span>
                    <span>{thisData?.endedAt && dayjs(thisData.endedAt).format('MM월 DD일  HH시 mm분')}</span>
                  </div>
                </div>

                {/* 보관소 */}
                <div className="reserve-confirm-data-wrapper">
                  <span className="reserve-confirm-data-key">보관소</span>
                  <span className="reserve-confirm-data-value">{thisData?.store}<span className="reserve-confirm-content-gray"> 보관소</span></span>
                </div>

              </div>
            )}

            {/* <hr className="reserve-confirm-line" /> */}

            <div className="reserve-confirm-content-data-container-middle">

              {/* 결제 금액 */}
              <div className="reserve-confirm-data-wrapper border-none background-color-var-bottari-offwhite margin-0-5-rem">
                <span className="reserve-confirm-data-key">결제 금액</span>
                <span className="reserve-confirm-data-value font-size-1-2-rem font-weight-700">{thisData?.price.toLocaleString()} 원</span>
              </div>

            </div>
          </div>
        </div>




        {/* 결제 버튼 - 토스 */}
        <CheckoutPage payData={thisData} password={password} />

      </motion.div>
    </>
  )
}