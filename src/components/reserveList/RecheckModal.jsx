import { X } from "lucide-react";
import "./RecheckModal.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { guestReservationCancel, userReservationCancel } from "../../store/thunks/reserveThunk.js";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RecheckModal({ modalFlgfalse, data}) {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== redux state
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);

  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);  // 동의 확인용
  const [isSubmitting, setIsSubmitting] = useState(false);  // 디바운싱용

  // ======================
  // ||     이유 입력     ||
  // ===== local states
  const [reason, setReason] = useState('취소 사유');
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

  // ==========================
  // ||     step handler     ||
  // ===== step 1 -> 2
  const handle1to2 = () => {
    if(reason === '취소 사유' || reason.trim() === '') {
      toast.error('취소 사유를 입력해 주세요.');
      return;
    }
    setStep1(false);
    setStep2(true);
  }

  // ===== step 2 -> 1
  const handle2to1 = () => {
    setStep1(true);
    setStep2(false);
  }

  // ======================
  // ||     예약 취소     ||
  const handleCancelReservation = async() => {
    if (!isLoggedIn && password.length < 4) {
      toast.error('비밀번호를 확인해 주세요.');
      return;
    }
    if (isSubmitting) return; // 요청중
    if (!isConfirmEnabled) return; // 조건(체크+취소사유+비번) 미충족

    // 1. 요청 시작
    setIsSubmitting(true);  // 요청 시작
    // 1-1. 보낼 데이터 정리
    const sendData = {
      reservId: data.id,
      reason: reason,
      ...( !isLoggedIn && { password: password } )
    }

    // 2. thunk 실행 : 로그인 여부로
    const action = isLoggedIn ? userReservationCancel : guestReservationCancel;
    dispatch(action(sendData)).unwrap()
      .then(() => {
        toast.success('예약이 정상적으로 취소되었습니다.');
        modalFlgfalse();
      })
      .catch((err) => {
        console.error(err);
        toast.error('예약 취소에 실패했습니다.');
        setIsSubmitting(false);
      });
  }



  return(
    <>
      {/* 블러 배경 */}
      <motion.div
        className="recheck-modal-background"
        onClick={modalFlgfalse}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* 흰 영역 */}
      <motion.div
        className="recheck-modal-cotainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >

        <div className="recheck-modal-x-wrapper" >
          <span className="recheck-modal-x-" onClick={modalFlgfalse}><X size={30}  /></span>
        </div>

        {/* 1단계 : 사유 입력 */}
        {
          step1 && (
            <div className="recheck-modal-step-container">
              <span className="recheck-modal-data-title">해당 예약을 취소하시겠습니까?</span>

              <div className="recheck-modal-notice-wrapper">
                <div className="recheck-modal-data-wrapper">
                  <div className="recheck-modal-data">
                    <span className="recheck-modal-data-label">{data.code.startsWith('D') ? '배송' : '보관'}코드</span>
                    <span className="recheck-modal-data-value">{data.code}</span>
                  </div>
                  <div className="recheck-modal-data">
                    <span className="recheck-modal-data-label">시작일</span>
                    <span className="recheck-modal-data-value">{dayjs(data.startedAt).format('YYYY-MM-DD HH:mm')}</span>
                  </div>
                </div>
              </div>

              <div className="recheck-modal-notice-wrapper">
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
                  onClick={ () => { handle1to2() }}
                >다음</div>
              </div>

            </div>
          )
        }

        {/* 2단계 : 약관 안내 & 비밀번호 작성 */}
        {
          step2 && (
            <div className="recheck-modal-step-container">
              <span className="recheck-modal-data-title">예약을 취소하시겠습니까?</span>

              <div className="recheck-modal-notice-wrapper">
                <div className="recheck-modal-terms">
                  <span className="recheck-modal-term">취소 후에는 예약을 복구할 수 없습니다.</span>
                  <span className="recheck-modal-term">결제 수단에 따라 환불까지 3~5일이 소요될 수 있습니다.</span>
                  <span className="recheck-modal-term">취소 시점에 따라 환불 금액이 상이할 수 있으니 이용안내를 참고 바랍니다.</span>
                </div>

                <div className="recheck-modal-checkbox">
                  <label onClick={() => setIsAgreed(true)}>
                    <input type="checkbox" className="recheck-modal-check" />
                    <span className="recheck-modal-checkbox-text"> 위 내용을 모두 확인했습니다.</span>
                  </label>
                </div>
              </div>

              {
                !isLoggedIn && (
                  <div className="recheck-modal-password-wrapper">
                    <label htmlFor="password" className="recheck-modal-password-label">비밀번호를 한 번 더 입력해 주세요.</label>
                    <input type="password" id="password" className="recheck-modal-password-input"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )
              }

              <div className="recheck-modal-btn-wrapper">
                <div className="rechck-modal-btn"
                  onClick={() => { handle2to1() }}
                >취소</div>
                <div className="rechck-modal-btn background-color-var-navy"
                  onClick={handleCancelReservation}
                  disabled={!isConfirmEnabled || isSubmitting}
                >예약취소하기</div>
              </div>
            </div>
          )
        }

      </motion.div>
    </>
  )
}