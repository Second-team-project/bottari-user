import "./ReserveComplete.css";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Copy } from 'lucide-react';
import { useDispatch } from "react-redux";
import { reserveComplete } from "../../store/thunks/reserveThunk.js";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ReserveComplete() {
  // ===== hooks
  const dispatch = useDispatch();
  const { reserveCode } = useParams();

  // ===== 로컬 states
  const [completeData, setCompleteData] = useState({})
  const [type, setType] = useState('');

  // ===== 스크롤 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 출력할 정보 thunk 로 받아오기
  useEffect(() => {
    dispatch(reserveComplete(reserveCode)).unwrap()
      .then( res => {
        setCompleteData(res);
        if(res?.code?.startsWith('D')) {  // complete데이터는 시간이 걸리므로, res로 타입부터 설정
          setType('D');
          return;
        }
        if(res?.code?.startsWith('S')) {
          setType('S');
          return;
        }
      })
      .catch(error => {
        console.error("조회 실패:", error);
        toast.error('에러가 발생했습니다. 예약페이지에서 조회해주세요.')
      })
  }, [dispatch, reserveCode])


  // 복사 아이콘 조작
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(reserveCode);
      toast.success("예약 코드가 복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
      toast.error("복사에 실패했습니다.");
    }
  }


  return(
    <>
      {/* 전체 컨테이너 */}
      <motion.div
        className="reserve-complete-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 페이지 제목 */}
        <div className="reserve-complete-title-wrapper page-title-wrapper">
          <h2 className="reserve-complete-title">예약 완료</h2>
        </div>

        {/* 데이터 */}
        <div className="reserve-complete-data-container reserve-form-body">

          {/* 예약 코드 */}
          <div className="reserve-form-content-container reserve-complete-margin-updonw">
            <div className="reserve-complete-reserve-code-wrapper">
              <span className="reserve-complete-reserve-code-notice"><span>{completeData.userName || '고객'}</span>님의 예약코드는 아래와 같습니다.</span>
              <div className="reserve-complete-reserve-code-copy" onClick={handleCopyCode}>
                <span className="reserve-complete-reserve-code">{reserveCode}{' '}<span className="reserve-complete-copy-icon"><Copy size={16} title="예약 코드 복사" />복사하기</span></span>
              </div>
              {/* 안내문구  */}
              <div className="reserve-complete-notice-wrapper">
                <p className="reserve-complete-notice-text">예약코드 분실 시 예약 조회가 불가합니다.</p>
                <p className="reserve-complete-notice-text">예약코드를 꼭 보관해주세요!</p>
              </div>
            </div>


          </div>

          <div className="reserve-form-content-container">
            <div className="reserve-complete-content-title">
              {
                type && (
                  <span className="border-bottom-var-bottari-pink font-size-1-3-rem">
                    {type ==='D' ? '배송' : '보관'}
                  </span>
                )
              }
              <span>내용</span>
            </div>

            <div className="reserve-complete-content-data-body">

              <div className="reserve-confirm-content-data-container">

                {/* 요청사항 */}
                <div className="reserve-confirm-data-wrapper">
                  <span className="reserve-confirm-data-key">요청사항</span>
                  <span className="reserve-confirm-data-value">{completeData?.notes || <span className="reserve-confirm-content-gray">없음</span>}</span>
                </div>

                {/* 짐 정보 */}
                <div className="reserve-confirm-data-wrapper">
                  <span className="reserve-confirm-data-key">보따리</span>
                  <div className="reserve-confirm-data-value-wrapper">
                  {
                    completeData?.luggageList?.map((luggage, index) => (
                      <div key={index}>
                        <span>{luggage.itemType} {luggage?.itemSize && `(${luggage.itemSize})`} {luggage.itemWeight} {luggage.count}개</span>
                      </div>
                    ))
                  }
                  </div>
                </div>

                {/* ===== 배송 전용 항목 ===== */}
                {type === 'D' && (
                  <>
                    {/* 픽업 일시 */}
                    <div className="reserve-confirm-data-wrapper">
                      <span className="reserve-confirm-data-key">픽업</span>
                      <div className="reserve-confirm-data-value-wrapper">
                        <span>{completeData?.startedAt && new Date(completeData.startedAt).toLocaleString()}<span className="reserve-confirm-content-gray"></span></span>
                        <span className="reserve-confirm-content-data">{completeData?.startedAddr}</span>
                      </div>
                    </div>

                    {/* 도착 일시 */}
                    <div className="reserve-confirm-data-wrapper">
                      <span className="reserve-confirm-data-key">도착지</span>
                      <div className="reserve-confirm-data-value-wrapper">
                        <span className="reserve-confirm-content-data">{completeData?.endedAddr}</span>
                      </div>
                    </div>
                  </>
                )}
                    
                {/* ===== 보관 전용 항목 ===== */}
                {type === 'S' && (
                  <>
                    {/* 보관 날짜 */}
                    <div className="reserve-confirm-data-wrapper">
                      <span className="reserve-confirm-data-key">보관 기한</span>
                      <div className="reserve-confirm-data-value-wrapper">
                        <span>{completeData?.startedAt && new Date(completeData.startedAt).toLocaleString()}<span className="reserve-confirm-content-gray"> 부터</span></span>
                        <span>{completeData?.endedAt && new Date(completeData.endedAt).toLocaleString()}<span className="reserve-confirm-content-gray"> 까지</span></span>
                      </div>
                    </div>

                    {/* 보관소 */}
                    <div className="reserve-confirm-data-wrapper">
                      <span className="reserve-confirm-data-key">보관소</span>
                      <div className="reserve-confirm-data-value-wrapper">
                        <span>{completeData?.storeName}<span className="reserve-confirm-content-gray"> 보관소</span></span>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </>
  )
}