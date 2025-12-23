import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveStorage.css";
// ===== hooks
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// ===== components
import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";
// ===== slices
import { setStorageReserve } from "../../store/slices/reserveSlice.js";
// ===== utils
import { debounce } from "../../utils/debounceUtil.js";
// ===== icons
import { X } from 'lucide-react';
// ===== 달력 관련
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { toast } from "sonner";

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
  const [email, setEmail] = useState(savedData?.email || user?.email || '');
  const [phone, setPhone] = useState(savedData?.phone || user?.phone || '');
  const [password, setPassword] = useState('');
  const [passwordChk, setPasswordChk] = useState('');
  const [notes, setNotes] = useState(savedData?.notes || '');
  // ===== 짐종류용
  const [luggageModalFlg, setLuggageModalFlg] = useState(false)
  const [luggageInfo, setLuggageInfo] = useState(savedData?.luggageInfo || null)
  // ===== 보관소용
  const [storageStore, setStorageStore] = useState(savedData?.store || '');
  const [storageStoreId, setStorageStoreId] = useState(savedData?.storeId || null);
  // ===== 달력 커스텀용
  const [startDate, setStartDate] = useState(savedData?.startedAt ? new Date(savedData.startedAt) : null);
  const [endDate, setEndDate] = useState(savedData?.endedAt ? new Date(savedData.endedAt) : null);

  // TODO : DB 설계 이후 thunk로 보관소 받아오기
  const stores = [
    { id: 1, name: '대구역'},
    { id: 2, name: '동대구역'},
    { id: 3, name: '반월당역'},
    { id: 4, name: '서대구역'},
  ]

  // ===== input : 숫자 입력 용
  const handlerNumber = e => {
    const value = e.target.value;
    const onlyNumbers = value.replace(/[^0-9]/g, '')

    setPhone(onlyNumbers);
  }


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
    return ({
      type: 'STORAGE',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      userName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      startedAt: startDate ? startDate.toISOString() : null,
      endedAt: endDate ? endDate.toISOString() : null,
      store: storageStore.trim(),
      storeId: storageStoreId,
      luggageInfo: luggageInfo,
      notes: notes.trim(),
      price: 1,
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
  }, [name, email, phone, password, startDate, endDate, storageStore, luggageInfo, notes, saveToRedux]);

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
    if(formData.phone && !/^\d+$/.test(phone.trim()) ) {
      toast.error('전화번호는 숫자만 입력 가능합니다');
      return;
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
    if(!formData.store) {
      toast.error('보관소를 선택해주세요');
      return;
    }
    if(!formData.luggageInfo) {
      toast.error('보따리 종류를 선택해주세요');
      return;
    }
    // 2-2. 디바운스 기다리지 않고 즉시 redux 저장
    dispatch(setStorageReserve(formData));
    // 2-3. 결제 페이지로 이동
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
              {/* 이름 */}
              <div className="reserve-form-content">
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
                <label className="reserve-form-content-name">이메일 :</label>
                <input type="text" className="reserve-form-content-input" 
                  placeholder="보따리@보따리.com" 
                  value={email}
                  onChange={ (e) => setEmail(e.target.value) }
                  onBlur={ (e) => setEmail(e.target.value.trim()) }
                />
              </div>
              {/* 휴대폰 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">휴대폰 :</label>
                <input type="text" className="reserve-form-content-input" 
                  placeholder="숫자만 입력 해주세요" 
                  value={phone}
                  onChange={ (e) => handlerNumber(e) }
                  onBlur={ (e) => setPhone(e.target.value.trim()) }
                />
              </div>
              {/* 비밀번호 */}
              <div className="reserve-form-content">
                <label className="reserve-form-content-name">비밀번호 :</label>
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
                <label className="reserve-form-content-name">보관할 곳 :</label>
                <div className="reserve-storage-store-btn-wrapper">
                  {
                    stores.map((store) => {
                      return (
                        <div type="button" key={store.id} 
                          className={`reserve-storage-store-btn reserve-storage-store-btn-${storageStoreId === store.id ? 'active' : ''}`}
                          onClick={() => {setStorageStore(store.name); setStorageStoreId(store.id);}}
                        ><span>{store.name}</span></div>
                      )

                    })
                  }
                </div>
              </div>
              {/* 보따리 종류 */}
              <div className="reserve-form-content">
                <label htmlFor="luggage-type" className="reserve-form-content-name">보따리 종류 :</label>
                <div className="reserve-form-content-input-wrapper reserve-from-luggage-btn-wrapper">
                  <div className="reserve-form-content-input-div reserve-form-daypicker-wrapper"
                    onClick={ () => { setLuggageModalFlg(true) }}
                  >
                    <span>보따리 종류 선택</span>
                  </div>
                  {/* <div className="reserve-form-content-input-div"
                    onClick={ () => { setLuggageModalFlg(true) }}
                  >{ luggageInfo ? <span style={{color: '#000'}}>{`${luggageInfo.itemType} (${luggageInfo.itemSize}) ${luggageInfo.itemWeight}`}</span> : <span>보따리 종류를 선택하세요</span> }</div>
                  <span className="reserve-form-content-input-x"
                    onClick={() => setLuggageInfo('')}
                  ><X size={24}/></span> */}
                </div>    
              </div>
              {/* 요청사항 */}
              <div className="reserve-form-content reserve-form-content-textarea">
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
                <label className="reserve-form-content-name">결제 금액 :</label>
                <div>
                  <span>12000 원</span>
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