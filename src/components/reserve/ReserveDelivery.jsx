import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveDelivery.css";
// ===== hooks
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
// ===== components
import SearchLocationModal from "./selectModal/SearchLocationModal.jsx";
import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
// ===== slices
import { setDeliveryReserve } from "../../store/slices/reserveSlice.js";
// ===== utils
import { debounce } from "../../utils/debounceUtil.js";
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

  // ===== 비밀번호 (비회원용, UserInfoSection에 전달)
  const [password, setPassword] = useState('');
  const [passwordChk, setPasswordChk] = useState('');

  const [notes, setNotes] = useState(savedData?.notes || '');

  // ===== 주소 설정용 (객체 형태: { addr, addrDetail })
  const [locationModalFlg, setLocationModalFlg] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [startAddr, setStartAddr] = useState(savedData?.startedAddr?.addr || '');
  const [startAddrDetail, setStartAddrDetail] = useState(savedData?.startedAddr?.addrDetail || '');
  const [endAddr, setEndAddr] = useState(savedData?.endedAddr?.addr || '');
  const [endAddrDetail, setEndAddrDetail] = useState(savedData?.endedAddr?.addrDetail || '');

  // ===== 짐 설정용 
  const [luggageModalFlg, setLuggageModalFlg] = useState(false)
  const [luggageList, setLuggageList] = useState(savedData?.luggageList || [])

  // ===== 달력 커스텀용 & 픽업 일시
  const [pickupDate, setPickupDate] = useState(savedData?.startedAt ? new Date(savedData.startedAt) : null);

  // ===== 스크롤 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // ===== savedData 최신값 참조용 (무한루프 방지)
  const savedDataRef = useMemo(() => ({ current: savedData }), []);
  useEffect(() => {
    savedDataRef.current = savedData;
  }, [savedData]);

  // 1. 디바운스 redux 저장 (배송 정보만 - 내 정보는 UserInfoSection에서 저장)
  const saveToRedux = useMemo(() => {
    const debounceFunc = debounce((deliveryInfoData) => {
      const updatedData = {
        ...savedDataRef.current,
        ...deliveryInfoData,
      };
      dispatch(setDeliveryReserve(updatedData));
      console.log('배송예약 - 배송정보 redux 저장: ', deliveryInfoData);
    }, 1000);

    return debounceFunc;
  }, [dispatch]);

  // 1-2. 배송 정보 변경될 때마다 saveToRedux 실행
  useEffect(() => {
    saveToRedux({
      type: 'DELIVERY',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      startedAt: pickupDate ? pickupDate.toISOString() : null,
      startedAddr: { addr: startAddr.trim(), addrDetail: startAddrDetail.trim() },
      endedAddr: { addr: endAddr.trim(), addrDetail: endAddrDetail.trim() },
      luggageList: luggageList,
      notes: notes.trim(),
      price: totalPrice,
    });
  }, [pickupDate, startAddr, startAddrDetail, endAddr, endAddrDetail, luggageList, notes, totalPrice, saveToRedux]);

  // 2. 결제 페이지로 넘어가기 & 유효성 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // ===== 버튼 활성화 조건 (필수값 입력 여부만 체크)
  const isFormFilled =
    savedData?.userName &&
    savedData?.email &&
    pickupDate &&
    startAddr &&
    endAddr &&
    luggageList.length > 0 &&
    (user || (password && passwordChk));

  function handleNext() {
    // 최종 formData 생성 (redux의 내 정보 + 로컬 state의 배송 정보)
    const formData = {
      // 내 정보 (UserInfoSection에서 redux에 저장한 값)
      userName: savedData?.userName || '',
      email: savedData?.email || '',
      phone: savedData?.phone || '',
      // 배송 정보
      type: 'DELIVERY',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      startedAt: pickupDate ? pickupDate.toISOString() : null,
      startedAddr: { addr: startAddr.trim(), addrDetail: startAddrDetail.trim() },
      endedAddr: { addr: endAddr.trim(), addrDetail: endAddrDetail.trim() },
      luggageList: luggageList,
      notes: notes.trim(),
      price: totalPrice,
    };

    // 2-1. 유효성 검사
    if (!formData.userName) {
      toast.error('이름을 입력해주세요');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('이메일 주소를 입력해주세요');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error('올바른 이메일 형식이 아닙니다');
      return;
    }
    // 2-1-1. 유저가 아닌 경우만 비밀번호 체크
    if (!user) {
      if (!password || password.trim().length < 4) {
        toast.error('비밀번호를 4자리 이상 입력해주세요');
        return;
      }
      if (!passwordChk || passwordChk.trim().length < 4) {
        toast.error('비밀번호를 확인 해주세요');
        return;
      }
      if (password !== passwordChk) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    if (!formData.startedAt) {
      toast.error('픽업 시간을 선택해주세요');
      return;
    }
    if (!formData.startedAddr.addr) {
      toast.error('픽업 장소를 선택해주세요');
      return;
    }
    if (!formData.startedAddr.addr.startsWith('대구')) {
      toast.error('픽업 장소는 대구 지역만 선택 가능합니다');
      return;
    }
    if (!formData.endedAddr.addr) {
      toast.error('도착 장소를 선택해주세요');
      return;
    }
    if (!formData.endedAddr.addr.startsWith('대구')) {
      toast.error('도착 장소는 대구 지역만 선택 가능합니다');
      return;
    }
    if (formData.startedAddr.addr === formData.endedAddr.addr) {
      toast.error('픽업 장소와 도착 장소는 달라야합니다');
      return;
    }
    if (!formData.luggageList || formData.luggageList.length === 0) {
      toast.error('보따리 종류를 선택해주세요');
      return;
    }
    // 2-2. 디바운스 기다리지 않고 즉시 redux 저장
    dispatch(setDeliveryReserve(formData));
    // 2-3. sessionStorage에도 저장 (새로고침 대비, password는 보안상 저장 안함)
    saveReserveSession({ data: formData, type: 'DELIVERY' });
    // 2-4. 결제 페이지로 이동
    navigate('/reserve/confirm', { state: { type: 'DELIVERY', password: user ? null : password.trim() } });
  }
  

  return(
    <>
      {/* 전체 컨테이너 */}
      <motion.div
        className="reserve-form-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 장소 검색 모달 */}
        {
          locationModalFlg &&
          <SearchLocationModal
            setLocation={locationType === 'start' ? setStartAddr : setEndAddr}
            modalFlgFalse={() => setLocationModalFlg(false)}
            location={locationType === 'start' ? startAddr : endAddr}
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
          <UserInfoSection
            type="DELIVERY"
            password={password}
            setPassword={setPassword}
            passwordChk={passwordChk}
            setPasswordChk={setPasswordChk}
          />

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
                    locale="ko"
                    timeCaption="시간"
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
                <span className="reserve-form-content-notice-text">보따리 배송 가능 시간 : 09시 ~ 21시</span>
              </div>

              {/* 픽업장소 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label htmlFor="send-location" className="reserve-form-content-name">픽업 장소 :</label>
                
                <div className="reserve-form-content-input-wrapper">
                  {/* 주소 검색 */}
                  <div className="reserve-form-content-input-div"
                    onClick={() => { setLocationModalFlg(true); setLocationType('start'); }}
                  >{startAddr ? <span style={{color: '#000'}}>{startAddr}</span> : <span>주소를 선택하세요</span>}
                  </div>
                  <span className="reserve-form-content-input-x"
                    onClick={() => { setStartAddr(''); setStartAddrDetail(''); }}
                  ><X size={24}/></span>

                  {/* 상세주소 */}
                  <input className="reserve-form-content-input"
                    placeholder="상세 주소 (동/호수 등)"
                    value={startAddrDetail}
                    onChange={(e) => setStartAddrDetail(e.target.value)}
                    onBlur={(e) => setStartAddrDetail(e.target.value.trim())}
                  />
                  <span className="reserve-form-content-input-x"
                    onClick={() => setStartAddrDetail('')}
                  ><X size={24}/></span>
                </div>
              </div>
              
              {/* 도착장소 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label htmlFor="recieve-location" className="reserve-form-content-name">도착 장소 :</label>

                <div className="reserve-form-content-input-wrapper">
                  {/* 주소 검색 */}
                  <div className="reserve-form-content-input-div"
                    onClick={() => { setLocationModalFlg(true); setLocationType('end'); }}
                  >{endAddr ? <span style={{color: '#000'}}>{endAddr}</span> : <span>주소를 선택하세요</span>}</div>
                  <span className="reserve-form-content-input-x"
                    onClick={() => { setEndAddr(''); setEndAddrDetail(''); }}
                  ><X size={24}/></span>

                  {/* 상세주소 */}
                  <input className="reserve-form-content-input"
                    placeholder="상세 주소 (동/호수 등)"
                    value={endAddrDetail}
                    onChange={(e) => setEndAddrDetail(e.target.value)}
                    onBlur={(e) => setEndAddrDetail(e.target.value.trim())}
                  />
                  <span className="reserve-form-content-input-x"
                    onClick={() => setEndAddrDetail('')}
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
              style={{ opacity: isFormFilled ? 1 : 0.5, cursor: isFormFilled ? "pointer" : "not-allowed" }}
              onClick={handleNext}
            >배송 예약서 작성 완료</button>
          </div>

        </div>
      </motion.div>
    </>
  )
};