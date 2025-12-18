import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveDelivery.css";
import { useState } from "react";

// 달력 관련
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";

// 달력 요일 한국어 적용
registerLocale("ko", ko);

export default function ReserveDelivery() {
  // 선택된 날짜 저장할 state
  const [sendDate, setSendDate] = useState(null);    // 보낼 날짜
  const [receiveDate, setReceiveDate] = useState(null); // 받을 날짜 
  const [pickupTime, setPickupTime] = useState(null); // 받을 날짜 
  const [pickupDate, setPickupDate] = useState(null); // 받을 날짜 

  // ===== 달력 커스텀
  // 1. 최소 선택 가능 시간을 계산하는 함수
  const getMinTime = () => {
    const now = new Date();  // 지금 시각
    
    // 1-1. 운영 시작 시간 (오전 9시)
    const minOperating = new Date();
    minOperating.setHours(9, 0, 0, 0);
    
    // 2. 선택한 날짜가 "오늘"인지 확인
    if (pickupDate && pickupDate.toDateString() === now.toDateString()) {
      // 2-1. 오늘이면 → 지금 + 2시간
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      // 둘 중 더 늦은 시간 반환 : 현재시각+2시간 vs 운영시작시간
      return twoHoursLater > minOperating ? twoHoursLater : minOperating;
    }
    
    // 2-2. 내일 이후면 → 그냥 9시부터
    return minOperating;
  };

  // 3. 운영 종료 시간 (오후 9시)
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0, 0);



  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="reserve-delivery-container">
        {/* 페이지 제목 */}
        <div className="reserve-delivery-title-wrapper page-title-wrapper">
          <h2 className="reserve-delivery-title">보따리 옮기기</h2>
        </div>
        {/* 페이지 내용 컨테이너 */}
        <div className="reserve-delivery-body">

          {/* 내 정보 입력 */}
          <div className="reserve-delivery-content-container">
            <div className="reserve-delivery-content-title">
              <h3>내 정보</h3>
            </div>
            <div className="reserve-delivery-content-wrapper">
              <div className="reserve-delivery-content">
                <label htmlFor="name" className="reserve-delivery-content-name">이름 :</label>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <label className="reserve-delivery-content-name">이메일 :</label>
                <input htmlFor="email" type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <label htmlFor="phone" className="reserve-delivery-content-name">휴대폰 :</label>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <label htmlFor="password" className="reserve-delivery-content-name">비밀번호 :</label>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
            </div>
          </div>

          {/* 보따리 정보 입력 */}
          <div className="reserve-delivery-content-container">
            <div className="reserve-delivery-content-title">
              <h3 className="reserve-delivery-content-name">보따리 정보</h3>
            </div>
            <div className="reserve-delivery-content-wrapper">
              <div className="reserve-delivery-content">
                <label htmlFor="send-date" className="reserve-delivery-content-name">보낼 날짜 :</label>
                {/* <DatePicker
                  locale="ko"                   // 요일 한국어
                  selected={sendDate}           // 현재 선택된 값
                  onChange={(date) => setSendDate(date)}  // 날짜 선택하면 state 업데이트
                  dateFormat="yyyy년 MM월 dd일"  // 표시 형식
                  placeholderText="보낼 날짜를 선택하세요"
                  minDate={new Date()}          // 오늘 이전 날짜는 선택 불가
                />
                <DatePicker
                  selected={pickupTime}
                  onChange={(time) => setPickupTime(time)}
                  showTimeSelect
                  showTimeSelectOnly          // 시간만! 캘린더 숨김
                  timeIntervals={30}
                  minTime={new Date().setHours(9, 0)}   // 오전 9시부터
                  maxTime={new Date().setHours(21, 0)}  // 오후 9시까지
                  dateFormat="HH:mm"
                  placeholderText="시간을 선택하세요"
                /> */}
                {/* <DatePicker
                  selected={pickupDate}
                  onChange={(date) => setPickupDate(date)}
                  showTimeSelect              // 시간 선택 활성화!
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  timeFormat="HH:mm"
                  timeIntervals={30}          // 30분 단위로 선택 (15, 60 등 조절 가능)
                  minTime={new Date().setHours(9, 0)}   // 오전 9시부터
                  maxTime={new Date().setHours(21, 0)}  // 오후 9시까지
                  placeholderText="픽업 날짜/시간 선택"
                /> */}
                <DatePicker
                  withPortal
                  selected={pickupDate}
                  onChange={(date) => setPickupDate(date)}
                  showTimeSelect
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  timeIntervals={30}
                  minDate={new Date()}       // 오늘부터 선택 가능
                  minTime={getMinTime()}     // ⭐ 여기서 함수 호출
                  maxTime={maxTime}
                  placeholderText="픽업 날짜/시간 선택"
                  onCalendarOpen={() => document.body.style.overflow = 'hidden'}  //  스크롤 방지
                  onCalendarClose={() => document.body.style.overflow = 'unset'}
                />
              </div>
              <div className="reserve-delivery-content">
                <label htmlFor="recieve-date" className="reserve-delivery-content-name">받을 날짜 :</label>
                {/* <DatePicker
                  locale="ko"
                  selected={receiveDate}
                  onChange={(date) => setReceiveDate(date)}
                  dateFormat="yyyy년 MM월 dd일"
                  placeholderText="날짜를 선택하세요"
                  minDate={sendDate || new Date()}  // 보낼 날짜 이후만 선택 가능!
                /> */}
              </div>
              <div className="reserve-delivery-content">
                <label htmlFor="send-location" className="reserve-delivery-content-name">보내는 곳 :</label>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <label htmlFor="recieve-location" className="reserve-delivery-content-name">받을 곳 :</label>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <label htmlFor="luggage-type" className="reserve-delivery-content-name">보따리 종류 :</label>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content reserve-delivery-content-textarea">
                <label htmlFor="notes" className="reserve-delivery-content-name">요청사항 :</label>
                <textarea className="reserve-delivery-content-input reserve-delivery-textarea" rows="2"></textarea>
              </div>
            </div>
          </div>

          {/* 요청 사항 */}
          {/* <div className="reserve-delivery-content-container">
            <div className="reserve-delivery-content-title">
              <h3>요청사항</h3>
            </div>
            <div className="reserve-delivery-content-wrapper">
              <div className="reserve-delivery-content">
                <input type="text" className="reserve-delivery-content-input-notes" />
              </div>
            </div>
          </div> */}

          {/* 결제 */}
          <div className="reserve-delivery-content-container">
            <div className="reserve-delivery-content-title">
              <h3>결제</h3>
            </div>
            <div className="reserve-delivery-content-wrapper">
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">결제 금액 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <button type="button">결제하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};