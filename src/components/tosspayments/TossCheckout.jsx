import "./TossPayments.css";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { createDraftReservation } from "../../store/thunks/reserveThunk";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "D92-snC-QuCnLXSxDBK_p";

export default function TossCheckoutPage({ payData, password }) {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== states
  // === 결제버튼 디바운싱
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== 결제용 
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: Number(payData.price),
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  console.log('체크아웃: ', payData)

  // 1. 클라이언트키로 위젯 설정
  useEffect(() => {
    async function fetchPaymentWidgets() {
      // 1-1. 결제 위젯 초기화
      const tossPayments = await loadTossPayments(clientKey);
      // 1-2. 회원key or 비회원 설정
      // 1-2-1. 회원
      const widgets = tossPayments.widgets({
        customerKey,
      });
      // 1-2-2. 비회원
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  // 2. 위젯 랜더링
  useEffect(() => {
    async function renderPaymentWidgets() {
      // 2-1. 위젯 없으면 종료(TODO 나중에 체크 || ready)
      if (widgets == null) {
        return;
      }

      // 2-2. 위젯 있으면 진행
      // 2-2-1. 결제 금액 설정
      /**
       * 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
       * renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
       * @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
       */
      await widgets.setAmount({
        currency: "KRW",
        value: Number(payData.price),
      });

      // 2-2-2. 결제창 & 약관 렌더링 병렬 진행
      await Promise.all([
        /**
         * 결제창을 렌더링합니다.
         * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
         */
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          // 렌더링하고 싶은 결제 UI의 variantKey
          // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
          // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
          variantKey: "DEFAULT",
        }),
        /**
         * 약관을 렌더링합니다.
         * @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
         */
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);


  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        {/* <div>
          <div>
            <label htmlFor="coupon-box">
              <input
                id="coupon-box"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                onChange={(event) => {
                  // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
                  setAmount(event.target.checked ? amount - 5_000 : amount + 5_000);
                }}
              />
              <span>5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div> */}

        {/* 결제하기 버튼 */}
        <button
          className="button"
          disabled={!ready || isSubmitting}  // <- 저장 중에는 버튼 비활성화
          onClick={async () => {
            setIsSubmitting(true);  // <- 클릭 시작
            try {
              // 1. 예약 데이터 임시 저장 함수 호출
              const resultCraft = await dispatch(createDraftReservation({...payData, password})).unwrap();
              
              alert('password: ', password)
              alert('임시 저장 완료, reserveCode: ', resultCraft.reserveCode);

              // 2. '결제하기' 버튼 누르면 결제창 띄우기
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              await widgets.requestPayment({
                orderId: "uIppuZDuMmVIinchy7zfP",  // TODO: resultCraft.reserveCode
                orderName: payData.type === 'storage' ? '보따리 보관' : '보따리 배송',
                successUrl: window.location.origin + "/reserve/tosspayments/success",
                failUrl: window.location.origin + "/reserve/tosspayments/fail",
                customerEmail: payData.email,
                customerName: payData.userName,
                customerMobilePhone: payData.phone ? payData.phone : "01012341234",
              });

            } catch (error) {
              // 3. 에러 발생 시 처리
              if (error.type === 'DRAFT_SAVE_ERROR') {
                console.error('예약 정보 저장 실패');
              } else {
                toast.error(`결제를 시작할 수 없습니다: ${error.message || '알 수 없는 오류'}`);
              } 
            } finally {
              setIsSubmitting(false);  // <- 성공/실패 상관없이 버튼 다시 활성화
            }
          }}
        >{isSubmitting ? '처리 중...' : '결제하기'}</button>
      </div>
    </div>
  );
}