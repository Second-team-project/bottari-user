import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveStorage.css";
// ===== hooks
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
// ===== components
import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";
// ===== slices
import { setStorageReserve } from "../../store/slices/reserveSlice.js";
// ===== utils
import { debounce } from "../../utils/debounceUtil.js";
import { handlePhone } from "../../utils/handlePhone.js";
import { handleEmail } from "../../utils/handleEmail.js";
import { saveReserveSession } from "../../utils/sessionStorageUtil.js";
import { getStores } from "../../store/thunks/storeThunk.js";
// ===== icons
import { X } from 'lucide-react';
// ===== 달력 관련
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";

// 달력 요일 한국어 적용
registerLocale("ko", ko);

export default function ReserveStorage() {
  // ===== hooks
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // ===== redux states
  const savedData = useSelector(state => state.reserve.storageReserve);
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

  // ===== 짐종류용
  const [luggageModalFlg, setLuggageModalFlg] = useState(false)
  const [luggageList, setLuggageList] = useState(savedData?.luggageList || [])

  // ===== 보관소용
  const [storageStore, setStorageStore] = useState(savedData?.store || '');
  const [storageStoreId, setStorageStoreId] = useState(savedData?.storeId || null);
  const [storeList, setStoreList] = useState([])

  // ===== 달력 커스텀용
  const [startDate, setStartDate] = useState(savedData?.startedAt ? new Date(savedData.startedAt) : null);
  const [endDate, setEndDate] = useState(savedData?.endedAt ? new Date(savedData.endedAt) : null);

  
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
  
  // ===================
  // ||     보관소     || 
  // ===================
  useEffect(() => {
    dispatch(getStores()).unwrap()
    .then((res) => {
      setStoreList(res.data);
      console.log('ReserveStorage-store: ', res.data)
    })
      .catch(err => {
        console.log('ReserveStorage-store: ', err);
      })
    }, [])
    
    // TODO : DB 설계 이후 thunk로 보관소 받아오기
    const stores = [
      { id: 1, name: '대구역'},
      { id: 2, name: '동대구역'},
      { id: 3, name: '반월당역'},
      { id: 4, name: '서대구역'},
    ]
  // ====================
  // ||     짐 요금     || 
  // ====================
  const diffDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    
    const diffTime = endDate.getTime() - startDate.getTime();
    if (diffTime <= 0) return 0;
    
    // 24시간(86400000ms)으로 나누고 올림!
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);
  
  const totalPrice = useMemo(() => {
    const luggagePrice = luggageList.reduce((accumulator, current) => accumulator + (current.price || 0), 0)

    return luggagePrice * diffDays;
  }, [luggageList, diffDays]); 

  // ======================== 
  // ||     달력 커스텀     ||
  // ======================== 
  // 1. 맡기는 시간 필터
  const filterStartTime = (time) => {
    const now = new Date();  // 지금 시각
    const selectedDate = new Date(time);

    // 1-1. 오늘인지 확인
    if (now.toDateString() === selectedDate.toDateString()) {
      // 1-2. 오늘이면 → 지금 이후만 통과
      return selectedDate.getTime() > now.getTime();
    }
    // 1-3. 오늘 아니면 통과
    return true;
  };

  // 2. 찾는 시간 필터 (맡긴 시간 이후만 허용)
  // const filterEndTime = (time) => {
  //   const selectedDate = new Date(time);
  //   console.log('비교:', selectedDate.getHours(), 'vs', startDate.getHours());
  //   // 맡기는 시간이 아직 선택 안 됐으면 전부 통과
  //   if (!startDate) return true;

  //   // 날짜 비교를 위해 시간 초기화 (00:00:00)
  //   const startDay = new Date(startDate); startDay.setHours(0,0,0,0);
  //   const endDay = new Date(selectedDate); endDay.setHours(0,0,0,0);

  //   // 1. 맡길 날보다 과거면 선택 불가
  //   if (endDay < startDay) return false;
    
  //   // 2. 같은 날이면 → 맡긴 시간 이후만 통과
  //   if (endDay.getTime() === startDay.getTime()) {
  //     return selectedDate.getTime() > startDate.getTime();
  //   }
    
  //   // 3. 미래 날짜면 통과
  //   return true;
  // };

  // ==========================
  // ||     결제 페이지로     ||
  // ==========================

  // 1. 디바운스 redux 저장
  // 1-1. formData 생성
  const createFormData = () => {
    const phone = (phone2 && phone3) ? `${phone1}${phone2}${phone3}`.trim() : '';

    return ({
      type: 'STORAGE',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      userName: name.trim(),
      email: `${emailId}@${emailDomain}`.trim(),
      phone: phone,
      startedAt: startDate ? startDate.toISOString() : null,
      endedAt: endDate ? endDate.toISOString() : null,
      store: storageStore.trim(),
      storeId: storageStoreId,
      luggageList: luggageList,
      notes: notes.trim(),
      price: totalPrice,
    });
  };
  // 1-2. 디바운싱 적용 함수 생성 : useCallback -> useMemo 로 변경
    const saveToRedux = useMemo(() => {
      const debounceFunc =
      debounce((data) => {
        dispatch(setStorageReserve(data));
        console.log('보관예약 - redux 저장: ', data);
      }, 1000);   // 1초 후 저장
    
      return debounceFunc;
    }, [dispatch] ) // dispatch 바뀔 때만 재생성 : data 변경 시엔 재생성x 

  // 1-3. formData 변경될 때마다 saveToRedux 실행
  useEffect(() => {
    const formData = createFormData();
    saveToRedux(formData);  // 디바운싱 적용!
  }, [name, emailId, emailDomain, phone1, phone2, phone3, password, startDate, endDate, storageStore, luggageList, notes, saveToRedux]);

  // 2. 결제 페이지로 넘어가기 & 유효성 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const fullEmail = `${emailId}@${emailDomain}`.trim();
  
  function handleNext() {
    // formData = 로컬state 생성
    const formData = createFormData();
    const diffTime = new Date(formData.endedAt).getTime() - new Date(formData.startedAt).getTime();
    const maxTime = 7 * 24 * 60 * 60 * 1000;

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
      if(!passwordChk || password.trim().length < 4 ) {
        toast.error('비밀번호를 확인 해주세요');
        return;
      }
      if(password !== passwordChk ) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    if(!formData.startedAt) {
      toast.error('맡길 시간을 선택해주세요');
      return;
    }
    if(!formData.endedAt) {
      toast.error('찾을 시간을 선택해주세요');
      return;
    }
    if (new Date(formData.startedAt) >= new Date(formData.endedAt)) {
      toast.error('찾을 시간은 맡길 시간 이후여야 합니다.');
      return;
    }
    if (diffTime > maxTime) {
      toast.error('최대 보관 기간은 7일입니다.');
      return;
    }
    if(!formData.store) {
      toast.error('보관소를 선택해주세요');
      return;
    }
    if(!formData.luggageList || formData.luggageList.length === 0) {
      toast.error('보따리 종류를 선택해주세요');
      return;
    }
    // 2-2. 디바운스 기다리지 않고 즉시 redux 저장
    dispatch(setStorageReserve(formData));
    // 2-3. sessionStorage에도 저장 (새로고침 대비, password는 보안상 저장 안함)
    saveReserveSession({ data: formData, type: 'STORAGE' });
    // 2-4. 결제 페이지로 이동
    navigate('/reserve/confirm', { state: { type: 'STORAGE', password: password.trim(), } });
  }





  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="reserve-form-container">
        {/* 짐 선택 모달 */}
        {
          luggageModalFlg &&
          <SelectLuggageModal
            modalFlgFalse={() => setLuggageModalFlg(false)}
            serviceType={'S'}
            setLuggageList={(item) => {
              setLuggageList(prev => [...prev, {...item, id: Date.now()}])
            }}
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
              {/* 이름 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">이름 :</label>
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
                      <label className="reserve-form-content-name">비밀번호 :</label>
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
                      <span className="reserve-form-content-notice-text"><span className="reserve-form-essential">*</span>비밀번호는 예약을 조회할 때 사용됩니다</span>
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
              {/* 맡길 날짜 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">맡길 날짜 :</label>
                <div className="reserve-form-daypicker-wrapper">
                  <DatePicker
                    withPortal
                    selected={startDate}
                    onChange={(date) => {
                      if (!date) {
                        setStartDate(null);
                        return;
                      }

                      const now = new Date();
                      // 오늘 날짜를 선택했고, 시간이 현재보다 과거인 경우 (예: 날짜 클릭 직후 00:00)
                      if (date.toDateString() === now.toDateString() && date.getTime() < now.getTime()) {
                        const minutes = now.getMinutes();
                        const remainder = 30 - (minutes % 30); // 다음 30분 단위까지 남은 분
                        
                        const adjustedDate = new Date(now);
                        adjustedDate.setMinutes(minutes + remainder);
                        adjustedDate.setSeconds(0);
                        adjustedDate.setMilliseconds(0);

                        // 조정된 시간 적용
                        date.setHours(adjustedDate.getHours());
                        date.setMinutes(adjustedDate.getMinutes());
                      }
                      setStartDate(date);
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
              </div>
              {/* 찾을 날짜 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">찾을 날짜 :</label>
                <div className="reserve-form-daypicker-wrapper">
                  <DatePicker
                    withPortal
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showTimeSelect
                    dateFormat="yyyy년 MM월 dd일 HH:mm"
                    timeIntervals={30}
                    minDate={startDate || new Date()}
                    filterTime={filterStartTime}
                    placeholderText="찾는 날짜/시간 선택"
                    onCalendarOpen={() => document.body.style.overflow = 'hidden'}  //  스크롤 방지
                    onCalendarClose={() => document.body.style.overflow = 'unset'}
                  />
                </div>
              </div>
              {/* 보관소 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">보관할 곳 :</label>
                <div className="reserve-storage-store-btn-wrapper">
                  { 
                    storeList.length >= 1 &&
                      storeList.map((store) => {
                        return (
                          <div type="button" key={store.id} 
                            className={`reserve-storage-store-btn reserve-storage-store-btn-${storageStoreId === store.id ? 'active' : ''}`}
                            onClick={() => {setStorageStore(store.storeName); setStorageStoreId(store.id);}}
                          ><span>{store.storeName}</span></div>
                        )
                      })
                  }
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
                <span className="reserve-form-essential">{' '}</span>
                <label className="reserve-form-content-name">요청사항 :</label>
                <textarea type="text" className="reserve-form-content-input reserve-form-textarea" 
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
            >보관 예약서 작성 완료</button>
          </div>

        </div>
      </div>
    </>
  )
};