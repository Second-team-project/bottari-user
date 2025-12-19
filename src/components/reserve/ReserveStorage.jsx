import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveStorage.css";
import { useState } from "react";

import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";

// icon
import { X } from 'lucide-react';

// 달력 관련
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";

// 달력 요일 한국어 적용
registerLocale("ko", ko);

export default function ReserveStorage() {
  // ========================== 
  // ||     달력 커스텀용     || 
  // ===== state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ===== 달력 커스텀
  // 1. 맡기는 시간 필터
  const filterStartTime = (time) => {
    const now = new Date();  // 지금 시각
    const selectedDate = new Date(time);

    // 오늘인지 확인
    if (now.toDateString() === selectedDate.toDateString()) {
      // 오늘이면 → 지금 이후만 통과
      return selectedDate.getTime() > now.getTime();
    }
    
    return true;
  };

  // 2. 찾는 시간 필터 (맡긴 시간 이후만 허용)
  const filterEndTime = (time) => {
    const selectedDate = new Date(time);
    
    // 맡기는 시간이 아직 선택 안 됐으면 전부 통과
    if (!startDate) return true;
    
    // 같은 날이면 → 맡긴 시간 이후만 통과
    if (startDate.toDateString() === selectedDate.toDateString()) {
      return selectedDate.getTime() > startDate.getTime();
    }
    
    // 다른 날이면 전부 통과
    return true;
  };

  // ====================== 
  // ||     보관소 용     ||
  // ===== state
  const [storageStore, setStorageStore] = useState('');

  // TODO : DB 설계 이후 thunk로 보관소 받아오기
  const stores = ['대구역', '반월당역', '동대구역', '서대구역']

  // ====================== 
  // ||     짐 설정용     ||
  // ===== state
  const [luggageModalFlg, setLuggageModalFlg] = useState(false)
  const [luggageInfo, setLuggageInfo] = useState(null)

  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="reserve-form-container">
        {/* 짐 선택 모달 */}
        {
          luggageModalFlg &&
          <SelectLuggageModal
            modalFlgFalse={() => setLuggageModalFlg(false)}
            setLuggageInfo={setLuggageInfo}
          />
        }

        {/* 페이지 제목 */}
        <div className="reserve-form-title-wrapper page-title-wrapper">
          <h2 className="reserve-form-title">보따리 맡기기</h2>
        </div>
        {/* 페이지 내용 컨테이너 */}
        <div className="reserve-form-body">

          {/* 내 정보 입력 */}
          <div className="reserve-form-content-container">
            <div className="reserve-form-content-title">
              <h3>내 정보</h3>
            </div>
            <div className="reserve-form-content-wrapper">
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">이름 :</label>
                <input type="text" className="reserve-form-content-input" placeholder="보따리" />
              </div>
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">이메일 :</label>
                <input type="text" className="reserve-form-content-input" placeholder="보따리@보따리.com" />
              </div>
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">휴대폰 :</label>
                <input type="text" className="reserve-form-content-input" placeholder="010.보따리.보따리" />
              </div>
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">비밀번호 :</label>
                <input type="text" className="reserve-form-content-input" placeholder="조회할 때 사용할 비밀번호" />
              </div>
            </div>
          </div>

          {/* 보따리 정보 입력 */}
          <div className="reserve-form-content-container">
            <div className="reserve-form-content-title">
              <h3 className="reserve-form-content-name">보따리 정보</h3>
            </div>
            <div className="reserve-form-content-wrapper">
              {/* 맡길 날짜 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">맡길 날짜 :</label>
                <DatePicker
                  withPortal
                  selected={startDate}
                  onChange={(date) => {
                    // 유효한 시간인지 확인 후에만 저장
                    if (date && filterStartTime(date)) {
                      setStartDate(date);
                    }
                  }}
                  showTimeSelect
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  timeIntervals={30}
                  minDate={new Date()} // 오늘부터 가능
                  filterTime={filterStartTime}
                  placeholderText="맡길 날짜/시간 선택"
                  onCalendarOpen={() => document.body.style.overflow = 'hidden'}  //  스크롤 방지
                  onCalendarClose={() => document.body.style.overflow = 'unset'}
                />
              </div>
              {/* 찾을 날짜 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">찾을 날짜 :</label>
                <DatePicker
                  withPortal
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  timeIntervals={30}
                  minDate={startDate || new Date()}
                  filterTime={filterEndTime}  // ⭐ 여기!
                  placeholderText="찾는 날짜/시간"
                  onCalendarOpen={() => document.body.style.overflow = 'hidden'}  //  스크롤 방지
                  onCalendarClose={() => document.body.style.overflow = 'unset'}
                />
              </div>
              {/* 보관소 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">보관할 곳 :</label>
                <div className="reserve-storage-store-btn-wrapper">
                  {
                    stores.map(store => (
                      <div type="button" key={store} 
                        className={`reserve-storage-store-btn reserve-storage-store-btn-${storageStore === store ? 'active' : ''}`}
                        onClick={() => setStorageStore(store)}
                      ><span>{store}</span></div>
                    ))
                  }
                </div>
              </div>
              {/* 보따리 종류 */}
              <div className="reserve-form-content">
                <label htmlFor="luggage-type" className="reserve-form-content-name">보따리 종류 :</label>
                <div className="reserve-form-content-input-wrapper">
                  <div className="reserve-form-content-input-div"
                    onClick={ () => { setLuggageModalFlg(true) }}
                  >{ luggageInfo ? <span style={{color: '#000'}}>{luggageInfo.type} ({luggageInfo.size}) {luggageInfo.weight}</span> : <span>보따리 종류를 선택하세요</span> }</div>
                  <span className="reserve-form-content-input-x"
                    onClick={() => setLuggageInfo('')}
                  ><X size={24}/></span>
                </div>    
              </div>
              {/* 요청사항 */}
              <div className="reserve-form-content reserve-form-content-textarea">
                <label className="reserve-form-content-name">요청사항 :</label>
                <textarea type="text" className="reserve-form-content-input reserve-form-textarea" rows="2"></textarea>
              </div>
            </div>
          </div>

          {/* 결제 */}
          <div className="reserve-form-content-container">
            <div className="reserve-form-content-title">
              <h3>결제</h3>
            </div>
            <div className="reserve-form-content-wrapper">
              {/* 결제 금액 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">결제 금액 :</label>
                <div>
                  <span>12000 원</span>
                </div>
              </div>
            </div>
          </div>

          {/* 완료 버튼 */}
          <div className="reserve-form-complete-btn-wrapper">
            <button type="button" className="reserve-form-complete-btn">보관 예약서 작성 완료</button>
          </div>

        </div>
      </div>
    </>
  )
};