import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveDelivery.css";
// ===== hooks
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// ===== components
import SearchLocationModal from "./selectModal/SearchLocationModal.jsx";
import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";
// ===== slices
import { setDeliveryReserve } from "../../store/slices/reserveSlice.js";
// ===== utils
import { debounce } from "../../utils/debounceUtil.js";
// ===== icons
import { X } from 'lucide-react';
// ===== 달력 관련
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
// ===== toast
import { toast } from "sonner";

// 달력 요일 한국어 적용
registerLocale("ko", ko);

export default function ReserveDelivery() {
  // ===== hooks
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // ===== redux states
  const savedData = useSelector(state => state.reserve.deliveryReserve);
  const user = useSelector(state => state.auth.user);

  // ===== 개인 정보 설정용
  const [name, setName] = useState(savedData?.userName || user?.userName || '');
  const [email, setEmail] = useState(savedData?.email || user?.email || '');
  const [phone, setPhone] = useState(savedData?.phone || user?.phone || '');
  const [password, setPassword] = useState('');
  const [passwordChk, setPasswordChk] = useState('');
  const [notes, setNotes] = useState(savedData?.notes || '');
  // =====  주소 설정용
  const [locationModalFlg, setLocationModalFlg] = useState(false);
  const [startLocation, setStartLocation] = useState(savedData?.startedAddr || '');
  const [endLocation, setEndLocation] = useState(savedData?.endedAddr || '');
  const [locationType, setLocationType] = useState(null);
  // ===== 짐 설정용 
  const [luggageModalFlg, setLuggageModalFlg] = useState(false)
  const [luggageList, setLuggageList] = useState(savedData?.luggageList || [])
  // ===== 달력 커스텀용 & 픽업 일시
  const [pickupDate, setPickupDate] = useState(savedData?.startedAt ? new Date(savedData.startedAt) : null); // 픽업 날짜 

  // ===== reudux 에서 데이터 불러오는데 시간이 걸릴 경우 대비
  // useEffect(() => {
  //   if(!savedData && user) {
  //     // 작성&저장한 데이터가 없고, user 가 있을 경우
  //     if(!name && user.userName) setName(user.userName || '');
  //     if (!email && user.email) setEmail(user.email || '');
  //     if (!phone && user.phone) setPhone(user.phone || '');
  //   }
  // }, [user, savedData]);

  // ===== input : 숫자 입력 용
  const handlerNumber = e => {
    const value = e.target.value;
    const onlyNumbers = value.replace(/[^0-9]/g, '')

    setPhone(onlyNumbers);
  }

  // ========================
  // ||     달력 커스텀     || 
  // ========================
  // 1. 배송용 시간 필터 (운영시간 9시~21시 + 오늘이면 현재+2시간 이후)
  const filterDeliveryTime = (time) => {
    const now = new Date();
    const selectedDate = new Date(time);
    const hour = selectedDate.getHours();
    
    // 1-1. 운영시간 체크 (9시 ~ 21시)
    if (hour < 9 || hour >= 21) {
      return false;
    }
    
    // 1-2. 오늘인지 확인
    if (now.toDateString() === selectedDate.toDateString()) {
      // 오늘이면 → 현재 + 2시간 이후만 통과
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      return selectedDate.getTime() > twoHoursLater.getTime();
    }
    
    // 1-3. 미래 날짜면 운영시간 내 전부 통과
    return true;
  };
  
  // ==========================
  // ||     결제 페이지로     ||
  // ==========================
  
  // 1. 디바운스 redux 저장
  // 1-1. formData 생성
  const createFormData = () => {
    return ({
      type: 'DELIVERY',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      userName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      startedAt: pickupDate ? pickupDate.toISOString() : null,
      startedAddr: startLocation.trim(),
      endedAddr: endLocation.trim(),
      luggageList: luggageList,
      notes: notes.trim(),
      price: 1,
    });
  };

  // 1-2. 디바운싱 적용 함수 생성 : useCallback -> useMemo 로 변경
  const saveToRedux = useMemo(() => {
    const debounceFunc =
    debounce((data) => {
      dispatch(setDeliveryReserve(data));
      console.log('배송예약 - redux 저장: ', data);
    }, 1000);   // 1초 후 저장

    return debounceFunc;
  }, [dispatch] ) // dispatch 바뀔 때만 재생성 : data 변경 시엔 재생성x 

  // 1-3. formData 변경될 때마다 saveToRedux 실행
  useEffect(() => {
    const formData = createFormData();
    saveToRedux(formData);  // 디바운싱 적용!
  }, [name, email, phone, password, pickupDate, startLocation, endLocation, luggageList, notes, saveToRedux]);
  
  // 2. 결제 페이지로 넘어가기 & 유효성 검사
  function handleNext() {
    // formData = 로컬state 생성
    const formData = createFormData();

    // 2-1. 유효성 검사
    if(!formData.userName) {
      toast.error('이름을 입력해주세요')
      return;
    }
    if(!formData.email) {
      toast.error('이메일을 입력해주세요');
      return;
    }
      // 2-1-1. 유저가 아닌 경우만 비밀번호 체크
    if(!user) {
      if(!password || password.trim().length < 4 ) {
        toast.error('비밀번호를 4자리 이상 입력해주세요');
        return;
      }
      if(!passwordChk || passwordChk.trim().length < 4 ) {
        toast.error('비밀번호를 확인 해주세요');
        return;
      }
      if(password !== passwordChk ) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    if(!formData.startedAt) {
      toast.error('픽업 시간을 선택해주세요');
      return;
    }
    if(!formData.startedAddr) {
      toast.error('픽업 장소를 선택해주세요');
      return;
    }
    if (!formData.startedAddr.startsWith('대구')) {
      toast.error('픽업 장소는 대구 지역만 선택 가능합니다');
      return;
    }
    if(!formData.endedAddr) {
      toast.error('도착 장소를 선택해주세요');
      return;
    }
    if (!formData.endedAddr.startsWith('대구')) {
      toast.error('도착 장소는 대구 지역만 선택 가능합니다');
      return;
    }
    if(!formData.luggageList || formData.luggageList.length === 0) {
      toast.error('보따리 종류를 선택해주세요');
      return;
    }
    // 2-2. 디바운스 기다리지 않고 즉시 redux 저장
    dispatch(setDeliveryReserve(formData));
    // 2-3. 결제 페이지로 이동
    navigate('/reserve/confirm', { state: { type: 'DELIVERY', password: user ? null : password.trim(), } });
  }
  

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
            setLuggageList={(item) => {
              setLuggageList(prev => [...prev, {...item, id: Date.now()}])
            }}
          />
        }

        {/* 페이지 제목 */}
        <div className="reserve-form-title-wrapper page-title-wrapper">
          <h2 className="reserve-form-title">배송 예약</h2>
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
                <input type="text" className="reserve-form-content-input" 
                  placeholder="보따리"
                  value={name}
                  onChange={ (e) => setName(e.target.value) }
                  onBlur={ (e) => setName(e.target.value.trim()) }
                />
              </div>
              {/* 이메일 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">이메일 :</label>
                <input htmlFor="email" type="text" className="reserve-form-content-input"
                  placeholder="보따리@보따리.com"
                  value={email}
                  onChange={ (e) => setEmail(e.target.value) }
                  onBlur={ (e) => setEmail(e.target.value.trim()) }
                />
              </div>
              {/* 휴대폰 */}
              <div className="reserve-form-content">
                <label htmlFor="phone" className="reserve-form-content-name">휴대폰 :</label>
                <input type="text" className="reserve-form-content-input" 
                  placeholder="숫자만 입력 해주세요" 
                  value={phone}
                  onChange={ (e) => handlerNumber(e) }
                  onBlur={ (e) => setPhone(e.target.value.trim()) }
                />
              </div>
              {
                !user && (
                  <>
                    {/* 비밀번호 */}
                    <div className="reserve-form-content">
                      <label htmlFor="password" className="reserve-form-content-name">비밀번호 :</label>
                      <input type="password" className="reserve-form-content-input" 
                        placeholder="4글자 이상 입력 해주세요" 
                        onChange={ (e) => setPassword(e.target.value) }
                        onBlur={ (e) => setPassword(e.target.value.trim()) }
                      />
                    </div>
                    {/* 비밀번호 확인 */}
                    <div className="reserve-form-content">
                      <label htmlFor="password" className="reserve-form-content-name">비밀번호 확인 :</label>
                      <input type="password" className="reserve-form-content-input" 
                        placeholder="비밀번호 한 번 더 입력" 
                        onChange={ (e) => setPasswordChk(e.target.value) }
                        onBlur={ (e) => setPasswordChk(e.target.value.trim()) }
                      />
                    </div>
                    {/* 안내문구  */}
                    <div className="reserve-form-content-notice">
                      <span className="reserve-form-content-notice-text">비밀번호는 예약을 조회할 때 사용됩니다</span>
                    </div>
                  </>
                )
              }
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
                <div className="reserve-form-daypicker-wrapper">
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
              </div>
              {/* 안내문구  */}
              <div className="reserve-form-content-notice">
                <span className="reserve-form-content-notice-text">보따리 운영시간 : 09시 ~ 21시</span>
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
                  <div className="reserve-form-content-input-div reserve-form-daypicker-wrapper"
                    onClick={ () => { setLuggageModalFlg(true) }}
                  >
                    <span>보따리 종류 선택</span>
                  </div>
                </div>    
              </div>
              {/* 선택된 보따리 */}
              {
                luggageList.length >= 1 &&
                <div className="reserve-form-content">
                    <label htmlFor="luggage-list" className="reserve-form-content-name"></label>
                    <div className="reserve-form-luggage-container">
                    
                    {
                      luggageList.map((luggage) => (
                        <div className="reserve-form-content-luggage-wrapper" key={luggage.id}>
                        <div className="reserve-form-luggage-item">
                          <span style={{color: '#000'}}>{`${luggage.itemType} (${luggage.itemSize}) ${luggage.itemWeight} ${luggage.count}개`}</span>
                        </div>
                        <span className="reserve-form-luggage-btn-x"
                          onClick={() => setLuggageList(prev => prev.filter(item => item.id !== luggage.id))}
                          ><X size={24}/></span>
                      </div>
                      ))

                    }
                      
                    </div>
                  </div>

              }
              {/* 요청사항 */}
              <div className="reserve-form-content reserve-form-content-textarea">
                <label htmlFor="notes" className="reserve-form-content-name">요청사항 :</label>
                <textarea className="reserve-form-content-input reserve-form-textarea" 
                  rows="2"
                  value={notes}
                  maxLength={200}
                  onChange={e => setNotes(e.target.value)}
                  onBlur={ (e) => setNotes(e.target.value.trim()) }
                />
              </div>
              {/* 안내문구  */}
              <div className="reserve-form-content-notice">
                <span className="reserve-form-content-notice-text">요청사항 {notes.length}/200</span>
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
            <button type="button" className="reserve-form-complete-btn"
              onClick={handleNext}
            >배송 예약서 작성 완료</button>
          </div>

        </div>
      </div>
    </>
  )
};