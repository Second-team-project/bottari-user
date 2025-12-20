import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveDelivery.css";
import { useState } from "react";

import SearchLocationModal from "./selectModal/SearchLocationModal.jsx";
import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";

// icon
import { X } from 'lucide-react';

// 달력 관련
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { useNavigate } from "react-router-dom";

// 달력 요일 한국어 적용
registerLocale("ko", ko);

export default function ReserveDelivery() {
  // ===== hook
  const navigate = useNavigate()

  // ========================
  // ||     주소 설정용     ||
  // ===== state
  const [locationModalFlg, setLocationModalFlg] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState(null);
  const [locationType, setLocationType] = useState(null);

  // 선택된 날짜 저장할 state
  const [pickupDate, setPickupDate] = useState(null); // 픽업 날짜 
  
  // ========================== 
  // ||     달력 커스텀용     || 
  // ===== state
  // 1. 배송용 시간 필터 (운영시간 9시~21시 + 오늘이면 현재+2시간 이후)
  const filterDeliveryTime = (time) => {
    const now = new Date();
    const selectedDate = new Date(time);
    const hour = selectedDate.getHours();
    
    // 1. 운영시간 체크 (9시 ~ 21시)
    if (hour < 9 || hour >= 21) {
      return false;
    }
    
    // 2. 오늘인지 확인
    if (now.toDateString() === selectedDate.toDateString()) {
      // 오늘이면 → 현재 + 2시간 이후만 통과
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      return selectedDate.getTime() > twoHoursLater.getTime();
    }
    
    // 3. 미래 날짜면 운영시간 내 전부 통과
    return true;
  };
  
  // ====================== 
  // ||     짐 설정용     ||
  // ===== state
  const [luggageModalFlg, setLuggageModalFlg] = useState(false)
  const [luggageInfo, setLuggageInfo] = useState(null)

  // ==========================
  // ||     결제 페이지로     ||
  // =====
  function handlePayPage() {
    navigate()
  }

  console.log('luggageInfo: ', luggageInfo)
  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="reserve-form-container">
        {/* 장소 검색 모달 */}
        {
          locationModalFlg &&
          <SearchLocationModal 
            setLocation={locationType === 'start' ? setStartLocation : setEndLocation}
            modalFlgFalse={() => setLocationModalFlg(false)}
            location={locationType === 'start' ? startLocation : endLocation}
          /> 
        }
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
          <h2 className="reserve-form-title">보따리 옮기기</h2>
        </div>
        {/* 페이지 내용 컨테이너 */}
        <div className="reserve-form-body">

          {/* 내 정보 입력 */}
          <div className="reserve-form-content-container">
            <div className="reserve-form-content-title">
              <h3>내 정보</h3>
            </div>
            <div className="reserve-form-content-wrapper">
              {/* 이름 */}
              <div className="reserve-form-content">
                <label htmlFor="name" className="reserve-form-content-name">이름 :</label>
                <input type="text" className="reserve-form-content-input" placeholder="보따리" />
              </div>
              {/* 이메일 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">이메일 :</label>
                <input htmlFor="email" type="text" className="reserve-form-content-input" placeholder="보따리@보따리.com" />
              </div>
              {/* 휴대폰 */}
              <div className="reserve-form-content">
                <label htmlFor="phone" className="reserve-form-content-name">휴대폰 :</label>
                <input type="text" className="reserve-form-content-input" placeholder="010.보따리.보따리" />
              </div>
              {/* 비밀번호 */}
              <div className="reserve-form-content">
                <label htmlFor="password" className="reserve-form-content-name">비밀번호 :</label>
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
              {/* 픽업시간 */}
              <div className="reserve-form-content">
                <label htmlFor="send-date" className="reserve-form-content-name">픽업 시간 :</label>
                <DatePicker
                  withPortal
                  selected={pickupDate}
                  onChange={(date) => {
                    if (!date) {
                      setPickupDate(null);
                      return;
                    }
                    const hour = date.getHours();
                    // 9시 이전이나 21시 이후면 9시로 강제 설정
                    if (hour < 9 || hour >= 21) {
                      const correctedDate = new Date(date);
                      correctedDate.setHours(9, 0, 0, 0);
                      setPickupDate(correctedDate);
                    } else {
                      setPickupDate(date);
                    }
                  }}
                  showTimeSelect
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  timeIntervals={30}
                  minDate={new Date()}       // 오늘부터 선택 가능
                  filterTime={filterDeliveryTime}
                  placeholderText="픽업 날짜/시간 선택"
                  onCalendarOpen={() => document.body.style.overflow = 'hidden'}  //  스크롤 방지
                  onCalendarClose={() => document.body.style.overflow = 'unset'}
                />
              </div>
              {/* 픽업장소 */}
              <div className="reserve-form-content">
                <label htmlFor="send-location" className="reserve-form-content-name">픽업 장소 :</label>
                <div className="reserve-form-content-input-wrapper">
                  <div className="reserve-form-content-input-div"
                    onClick={ () => { setLocationModalFlg(true); setLocationType('start'); }}
                  >{startLocation ? <span style={{color: '#000'}}>{startLocation}</span> : <span>주소를 선택하세요</span>}</div>
                  <span className="reserve-form-content-input-x"
                    onClick={() => setStartLocation('')}
                  ><X size={24}/></span>
                </div>
              </div>
              {/* 도착장소 */}
              <div className="reserve-form-content">
                <label htmlFor="recieve-location" className="reserve-form-content-name">도착 장소 :</label>
                <div className="reserve-form-content-input-wrapper">
                  <div className="reserve-form-content-input-div"
                    onClick={ () => { setLocationModalFlg(true); setLocationType('end'); }}
                  >{endLocation ? <span style={{color: '#000'}}>{endLocation}</span> : <span>주소를 선택하세요</span>}</div>
                  <span className="reserve-form-content-input-x"
                    onClick={() => setEndLocation('')}
                  ><X size={24}/></span>
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
                <label htmlFor="notes" className="reserve-form-content-name">요청사항 :</label>
                <textarea className="reserve-form-content-input reserve-form-textarea" rows="2"></textarea>
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
                <div >
                  <span>12000 원</span>
                </div>
              </div>
            </div>
          </div>

          {/* 완료 버튼 */}
          <div className="reserve-form-complete-btn-wrapper">
            <button type="button" className="reserve-form-complete-btn">배송 예약서 작성 완료</button>
          </div>

        </div>
      </div>
    </>
  )
};