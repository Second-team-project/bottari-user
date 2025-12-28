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
import { handlePhone } from "../../utils/handlePhone.js";
import { handleEmail } from "../../utils/handleEmail.js";
import { saveReserveSession } from "../../utils/sessionStorageUtil.js";
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
  
  const { p1, p2, p3 } = handlePhone(savedData?.phone || user?.phone);
  const [phone1, setPhone1] = useState(p1);
  const [phone2, setPhone2] = useState(p2);
  const [phone3, setPhone3] = useState(p3);
  
  const [password, setPassword] = useState('');
  const [passwordChk, setPasswordChk] = useState('');
  
  const [notes, setNotes] = useState(savedData?.notes || '');
  
  // ===== 이메일 설정용
  const { id: initEmailId, domain: initEmailDomain } = handleEmail(savedData?.email || user?.email);
  const [emailId, setEmailId] = useState(initEmailId);
  const [emailDomain, setEmailDomain] = useState(initEmailDomain || 'naver.com');
  const [isDomainInput, setIsDomainInput] = useState(false);

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
  useEffect(() => {
    if(!savedData && user) {
      // 작성&저장한 데이터가 없고, user 가 있을 경우
      if(!name && user.userName) setName(user.userName || '');
      if (!emailId && user.email) {
        const { id, domain } = handleEmail(user.email || '');
        if(id) setEmailId(id);
        if(domain) setEmailDomain(domain);
      }
      if (!phone2 && !phone3 && user.phone) {
        const { p1, p2, p3 } = handlePhone(user.phone || '');
        if(p1) setPhone1(p1);
        if(p2) setPhone2(p2);
        if(p3) setPhone3(p3);
      }
    }
  }, [user, savedData]);

  // ========================
  // ||     휴대폰 번호     || 
  // ========================
  const handlePhone2 = e => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setPhone2(value)
    };
  }
  const handlePhone3 = e => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setPhone3(value)
    };
  }

  // ===================
  // ||     이메일     || 
  // ===================
  const handleDomainSelect = e => {
    const value = e.target.value;
    if(value === 'type') {
      setEmailDomain('');
      setIsDomainInput(true);
    } else {
      setIsDomainInput(false);
      setEmailDomain(value);
    }
  }

  // ====================
  // ||     짐 요금     || 
  // ====================
  const totalPrice = useMemo(() => {
    return luggageList.reduce((accumulator, current) => accumulator + (current.price || 0), 0)
  }, [luggageList]);

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
    const phone = (phone2 && phone3) ? `${phone1}${phone2}${phone3}`.trim() : '';

    return ({
      type: 'DELIVERY',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      userName: name.trim(),
      email: `${emailId}@${emailDomain}`.trim(),
      phone: phone,
      startedAt: pickupDate ? pickupDate.toISOString() : null,
      startedAddr: startLocation.trim(),
      endedAddr: endLocation.trim(),
      luggageList: luggageList,
      notes: notes.trim(),
      price: totalPrice,
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
  }, [name, emailId, emailDomain, phone1, phone2, phone3, password, pickupDate, startLocation, endLocation, luggageList, notes, saveToRedux]);
  
  // 2. 결제 페이지로 넘어가기 & 유효성 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const fullEmail = `${emailId}@${emailDomain}`.trim();

  function handleNext() {
    // formData = 로컬state 생성
    const formData = createFormData();

    // 2-1. 유효성 검사
    if(!formData.userName) {
      toast.error('이름을 입력해주세요')
      return;
    }
    if(!emailId || !emailDomain) {
      toast.error('이메일 주소를 모두 입력해주세요');
      return;
    }
    if(!emailRegex.test(fullEmail)) {
      toast.error('올바른 이메일 형식이 아닙니다');
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
    if(formData.startedAddr === formData.endedAddr) {
      toast.error('픽업 장소와 도착 장소는 달라야합니다');
      return;
    }
    if(!formData.luggageList || formData.luggageList.length === 0) {
      toast.error('보따리 종류를 선택해주세요');
      return;
    }
    // 2-2. 디바운스 기다리지 않고 즉시 redux 저장
    dispatch(setDeliveryReserve(formData));
    // 2-3. sessionStorage에도 저장 (새로고침 대비, password는 보안상 저장 안함)
    saveReserveSession({ data: formData, type: 'DELIVERY' });
    // 2-4. 결제 페이지로 이동
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
            serviceType={'D'}
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
                <span className="reserve-form-essential">*</span>
                <label htmlFor="name" className="reserve-form-content-name">이름:</label>
                <input type="text" className="reserve-form-content-input" 
                  placeholder="보따리"
                  value={name}
                  onChange={ (e) => setName(e.target.value) }
                  onBlur={ (e) => setName(e.target.value.trim()) }
                />
              </div>
              {/* 이메일 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">이메일 :</label>
                <div className="reserve-form-email-input-wrapper">
                  <input type="text" className="reserve-form-email-input" 
                    placeholder="아이디"
                    value={emailId}
                    onChange={e => setEmailId(e.target.value)}
                  />
                  <span className="reserve-form-email-at">@</span>
                  {
                    !isDomainInput ? (
                      <select name="email-domain" id="email-domain" className="reserve-form-email-input"
                      value={emailDomain}
                      onChange={handleDomainSelect}
                      >
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="type">직접 입력</option>
                      </select>
                    ) : (
                      <input type="text" className="reserve-form-email-input" 
                        placeholder="도메인"
                        value={emailDomain}
                        onChange={e => setEmailDomain(e.target.value)}
                      />
                    )
                  }
                </div>
              </div>
              {/* 휴대폰 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">{' '}</span>
                <label htmlFor="phone" className="reserve-form-content-name">휴대폰 :</label>
                <div className="reserve-form-phone-input-wrapper">
                  <select name="phone1" id="phone1" className="reserve-form-phone-input" 
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                  >
                    <option value={'010'}>010</option>
                    <option value={'011'}>011</option>
                    <option value={'016'}>016</option>
                  </select>
                  <span className="reserve-form-phone-dash">-</span>
                  <input type="text" className="reserve-form-phone-input" 
                    value={phone2}
                    onChange={handlePhone2}
                    placeholder="0000"
                    inputMode="numeric"
                  />
                  <span className="reserve-form-phone-dash">-</span>
                  <input type="text" className="reserve-form-phone-input" 
                    value={phone3}
                    onChange={handlePhone3}
                    placeholder="0000"
                    inputMode="numeric"
                  />
                </div>
              </div>
              {
                !user && (
                  <>
                    {/* 비밀번호 */}
                    <div className="reserve-form-content">
                      <span className="reserve-form-essential">*</span>
                      <label htmlFor="password" className="reserve-form-content-name">비밀번호 :</label>
                      <input type="password" className="reserve-form-content-input" 
                        placeholder="4글자 이상 입력 해주세요" 
                        onChange={ (e) => setPassword(e.target.value) }
                        onBlur={ (e) => setPassword(e.target.value.trim()) }
                      />
                    </div>
                    {/* 비밀번호 확인 */}
                    <div className="reserve-form-content">
                      <span className="reserve-form-essential">*</span>
                      <label htmlFor="password" className="reserve-form-content-name">비밀번호 확인 :</label>
                      <input type="password" className="reserve-form-content-input" 
                        placeholder="비밀번호 한 번 더 입력" 
                        onChange={ (e) => setPasswordChk(e.target.value) }
                        onBlur={ (e) => setPasswordChk(e.target.value.trim()) }
                      />
                    </div>
                    {/* 안내문구  */}
                    <div className="reserve-form-content-notice">
                      <span className="reserve-form-essential">*</span>
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
              <h3>보따리 정보</h3>
            </div>
            <div className="reserve-form-content-wrapper">
              {/* 픽업시간 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
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
                <span className="reserve-form-essential">*</span>
                <span className="reserve-form-content-notice-text">보따리 운영시간 : 09시 ~ 21시</span>
              </div>
              {/* 픽업장소 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
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
                <span className="reserve-form-essential">*</span>
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
                <span className="reserve-form-essential">*</span>
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
                // <div className="reserve-form-content">
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
                  // </div>

              }
              {/* 요청사항 */}
              <div className="reserve-form-content reserve-form-content-textarea">
                <span className="reserve-form-essential">{' '}</span>
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
                <span className="reserve-form-essential">{' '}</span>
                <label className="reserve-form-content-name">결제 금액 :</label>
                <div className="reserve-form-flex-rignt">
                  <span><span className="reserve-form-price">{totalPrice.toLocaleString()}</span> 원</span>
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