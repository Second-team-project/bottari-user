import { X } from "lucide-react";
import "./RecheckModal.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guestReservationCancel, userReservationCancel } from "../../store/thunks/reserveThunk.js";

export default function RecheckModal({ modalFlgfalse, data}) {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux state
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);

  const [isAgreed, setIsAgreed] = useState(false);
  const [password, setPassword] = useState("");

  // ======================
  // ||     이유 입력     ||
  // ===== local states
  const [reason, setReason] = useState('');
  const [isReasonInput, setIsReasonInput] = useState(false);

  // ===== 이유 작성
  const handleReason = e => {
    const value = e.target.value;
    if(value === '직접 입력') {
      setReason('');
      setIsReasonInput(true);
    } else {
      setIsReasonInput(false);
      setReason(value);
    }
  }

  // ===== 버튼 활성화 조건
  const isConfirmEnabled = isLoggedIn
    ? isAgreed
    : isAgreed && password.length >= 4;

  console.log('RecheckModal-reason: ', reason)

  // ========================
  // ||     스크롤 방지     ||
  // ========================
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);  

  console.log('password: ', password)
  // ======================
  // ||     예약 취소     ||
  const hadleCancelReservation = async() => {
    if(isLoggedIn) {
      const data = {
        reservId: data.id,
        reason: reason,
      }
      dispatch(userReservationCancel(data))
    }
    if(!isLoggedIn) {
      const data = {
        reservId: data?.id,
        reason: reason,
        password: password,
      }
      dispatch(guestReservationCancel(data))
    }
    // 모달 닫고 thunk 재호출
  }



  return(
    <>
      {/* 불투명 배경 */}
      <div className="recheck-modal-background" onClick={modalFlgfalse}></div>

      {/* 흰 영역 */}
      <div className="recheck-modal-cotainer">

        <div className="recheck-modal-x" onClick={modalFlgfalse}>
          <X size={30} />
        </div>

        {/* 1단계 : 사유 입력 */}
        {
          step1 && (
            <div className="recheck-modal-step-container">

              <div className="recheck-modal-notice-wrapper">
                <span>해당 예약을 취소하시겠습니까?</span>
                <div className="recheck-modal-data-wrapper">
                  <span>{data.code.startsWith('D') ? '배송' : '보관'} {data.code}</span>
                  <span>시작일 {dayjs(data.startedAt).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <span>취소하시는 사유를 알려주세요.</span>
                <div className="recheck-modal-select-wrapper">
                  <select name="reason" id="resaon-select"
                    className="recheck-modal-select"
                    value={reason}
                    onChange={handleReason}
                    >
                    <option value={'취소 사유'}>취소 사유 선택</option>
                    <option value={'여행 일정 변경'}>여행 일정 변경</option>
                    <option value={'정보 오입력'}>정보 오입력</option>
                    <option value={'서비스 불만'}>서비스 불만</option>
                    <option value={'단순 변심'}>단순 변심</option>
                    <option value={'직접 입력'}>직접 입력</option>
                  </select>
                  {
                    isReasonInput &&
                    <div className="recheck-modal-text-wrapper">
                      <textarea name="reason" id="reason-text" 
                        className="recheck-modal-text"
                        placeholder="예약을 취소하는 이유를 작성해 주세요."
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      ></textarea>
                      <span className="recheck-modal-text-length font-size-0-8-rem color-var-bottari-gray">{reason.length}/200</span>
                    </div>
                  }
                </div>
              </div>

              <div className="recheck-modal-btn-wrapper">
                <div className="rechck-modal-btn"
                  onClick={modalFlgfalse}
                >닫기</div>
                <div className="rechck-modal-btn background-color-var-navy"
                  onClick={ () => { setStep1(false); setStep2(true) }}
                >다음</div>
              </div>

            </div>
          )
        }

        {/* 2단계 : 약관 안내 & 비밀번호 작성 */}
        {
          step2 && (
            <div className="recheck-modal-step-container">
              <div className="recheck-modal-notice-wrapper">
                <span>예약을 취소하시겠습니까?</span>
                <div className="recheck-modal-terms">
                  <span className="recheck-modal-term">취소 후에는 예약을 복구할 수 없습니다.</span>
                  <span>결제 수단에 따라 환불까지 3~5일이 소요될 수 있습니다.</span>
                </div>
                <div className="recheck-modal-checkbox">
                  <label onClick={() => setIsAgreed(true)}>
                  <input type="checkbox" className="recheck-modal-check" />
                  <span>위 내용을 모두 확인했습니다.</span>
                  </label>
                </div>
              </div>
              <div className="recheck-modal-password-wrapper">
                <label htmlFor="password">비밀번호 : </label>
                <input type="password" id="password" className="recheck-modal-password-input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="recheck-modal-btn-wrapper">
                <div className="rechck-modal-btn"
                  onClick={() => { setStep1(true); setStep2(false) }}
                >취소</div>
                <div className="rechck-modal-btn background-color-var-navy">예약취소하기</div>
              </div>
            </div>
          )
        }

      </div>
    </>
  )
}