import "react-datepicker/dist/react-datepicker.css"; // 달력 기본 스타일
import "./ReserveForm.css";  // 예약페이지 공통 스타일
import "./ReserveStorage.css";
// ===== hooks
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
// ===== components
import SelectLuggageModal from "./selectModal/SelectLuggageModal.jsx";
import UserInfoSection from "./UserInfoSection.jsx";
// ===== slices
import { setStorageReserve } from "../../store/slices/reserveSlice.js";
// ===== utils
import { debounce } from "../../utils/debounceUtil.js";
import { saveReserveSession } from "../../utils/sessionStorageUtil.js";
import { getStores } from "../../store/thunks/storeThunk.js";
import { getAdditionalPricing } from "../../store/thunks/pricingThunk.js";
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

  // ===== 비밀번호 (비회원용, UserInfoSection에 전달)
  const [password, setPassword] = useState('');
  const [passwordChk, setPasswordChk] = useState('');

  const [notes, setNotes] = useState(savedData?.notes || '');

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

  // ===== 구간별 요금률
  const [additionalPricing, setAdditionalPricing] = useState([]);

  // ===== 스크롤 top 설정
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===================================
  // ||     Thunk로 데이터 받아오기     || 
  // ===== 보관소 가져오기
  useEffect(() => {
    dispatch(getStores()).unwrap()
    .then((res) => {
      setStoreList(res.data);
    })
      .catch(err => {
        console.error('ReserveStorage-store: ', err);
        toast.error('보관소 정보를 불러오지 못했습니다. 새로고침 해주세요.');
      })
    }, [dispatch])

  // ===== 구간별 요금률 가져오기
  useEffect(() => {
    dispatch(getAdditionalPricing()).unwrap()
      .then((res) => {
        setAdditionalPricing(res);
      })
      .catch(err => {
        console.error('ReserveStorage-additionalPricing: ', err);
        toast.error('요금 정보를 불러오지 못했습니다. 새로고침 해주세요.');
      })
  }, [dispatch])
    
  // ========================
  // ||     짐 요금 계산    ||
  // ===== 날짜 계산
  const diffDays = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const diffTime = endDate.getTime() - startDate.getTime();
    if (diffTime <= 0) return 0;

    // 24시간(86400000ms)으로 나누고 올림!
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // ===== 총 금액 (구간별 요금률 적용)
  const totalPrice = useMemo(() => {
    // 짐 기본가격 합계 (각 짐의 price는 이미 basePrice * count)
    const basePricePerDay = luggageList.reduce((acc, cur) => acc + (cur.price || 0), 0);

    // 날짜나 요금률 데이터가 없으면 0
    if (diffDays <= 0 || additionalPricing.length === 0) return 0;

    // 구간별 요금 계산
    let total = 0;

    // minVal 순으로 정렬
    const sortedPricing = [...additionalPricing].sort((a, b) => a.minValue - b.minValue);

    for (const tier of sortedPricing) {
      // 이 구간의 시작일과 끝일
      const tierStart = tier.minValue;
      const tierEnd = Math.min(tier.maxValue, diffDays);  // diffDays를 넘지 않게

      // 이 구간에 해당하지 않으면 스킵
      if (tierEnd < tierStart || tierStart > diffDays) continue;

      // 이 구간에서 계산할 일수
      const daysInTier = tierEnd - tierStart + 1;

      // 이 구간 금액 = 기본가 × (rate/100) × 일수
      total += basePricePerDay * (tier.rate / 100) * daysInTier;
    }

    return Math.round(total);  // 소수점 반올림
  }, [luggageList, diffDays, additionalPricing]); 

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

  // 맡길 수 있는 날 (오늘부터 한달 뒤 까지)
  const maxSelectableDate = new Date();
  maxSelectableDate.setMonth(maxSelectableDate.getMonth() + 1);

  // ==========================
  // ||     결제 페이지로     ||
  // ==========================

  // ===== savedData 최신값 참조용 (무한루프 방지)
  const savedDataRef = useMemo(() => ({ current: savedData }), []);
  useEffect(() => {
    savedDataRef.current = savedData;
  }, [savedData]);

  // 1. 디바운스 redux 저장 (보관 정보만 - 내 정보는 UserInfoSection에서 저장)
  // 1-1. 디바운싱 적용 함수 생성
  const saveToRedux = useMemo(() => {
    const debounceFunc = debounce((storageInfoData) => {
      const updatedData = {
        ...savedDataRef.current,
        ...storageInfoData,
      };
      dispatch(setStorageReserve(updatedData));
    }, 1000);

    return debounceFunc;
  }, [dispatch]);

  // 1-2. 보관 정보 변경될 때마다 saveToRedux 실행
  useEffect(() => {
    saveToRedux({
      type: 'STORAGE',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      startedAt: startDate ? startDate.toISOString() : null,
      endedAt: endDate ? endDate.toISOString() : null,
      store: storageStore.trim(),
      storeId: storageStoreId,
      luggageList: luggageList,
      notes: notes.trim(),
      price: totalPrice,
    });
  }, [startDate, endDate, storageStore, storageStoreId, luggageList, notes, totalPrice, saveToRedux]);

  // 2. 결제 페이지로 넘어가기 & 유효성 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // ===== 버튼 활성화 조건 (필수값 입력 여부만 체크)
  const isFormFilled =
    savedData?.userName &&
    savedData?.email &&
    startDate &&
    endDate &&
    storageStore &&
    luggageList.length > 0 &&
    (user || (password && passwordChk));

  function handleNext() {
    // 최종 formData 생성 (redux의 내 정보 + 로컬 state의 보관 정보)
    const formData = {
      // 내 정보 (UserInfoSection에서 redux에 저장한 값)
      userName: savedData?.userName || '',
      email: savedData?.email || '',
      phone: savedData?.phone || '',
      // 보관 정보
      type: 'STORAGE',
      userId: user?.id || null,
      userType: user ? 'MEMBER' : 'GUEST',
      savedAt: new Date().toISOString(),
      startedAt: startDate ? startDate.toISOString() : null,
      endedAt: endDate ? endDate.toISOString() : null,
      store: storageStore.trim(),
      storeId: storageStoreId,
      luggageList: luggageList,
      notes: notes.trim(),
      price: totalPrice,
    };

    const diffTime = formData.endedAt && formData.startedAt
      ? new Date(formData.endedAt).getTime() - new Date(formData.startedAt).getTime()
      : 0;
    const maxTime = 30 * 24 * 60 * 60 * 1000;

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
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('휴대폰 번호를 입력해주세요');
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
      toast.error('맡길 시간을 선택해주세요');
      return;
    }
    if (!formData.endedAt) {
      toast.error('찾을 시간을 선택해주세요');
      return;
    }
    if (new Date(formData.startedAt) >= new Date(formData.endedAt)) {
      toast.error('찾을 시간은 맡길 시간 이후여야 합니다.');
      return;
    }
    if (diffTime > maxTime) {
      toast.error('최대 보관 기간은 30일입니다.');
      return;
    }
    if (!formData.store) {
      toast.error('보관소를 선택해주세요');
      return;
    }
    if (!formData.luggageList || formData.luggageList.length === 0) {
      toast.error('보따리 종류를 선택해주세요');
      return;
    }
    // 2-2. 디바운스 기다리지 않고 즉시 redux 저장
    dispatch(setStorageReserve(formData));
    // 2-3. sessionStorage에도 저장 (새로고침 대비, password는 보안상 저장 안함)
    saveReserveSession({ data: formData, type: 'STORAGE' });
    // 2-4. 결제 페이지로 이동
    navigate('/reserve/confirm', { state: { type: 'STORAGE', password: user ? null : password.trim() } });
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
          <UserInfoSection
            type="STORAGE"
            password={password}
            setPassword={setPassword}
            passwordChk={passwordChk}
            setPasswordChk={setPasswordChk}
          />

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
                    locale="ko"
                    timeCaption="시간"
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
                    maxDate={maxSelectableDate}
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

              <div className="reserve-form-content-notice">
                <span className="reserve-form-content-notice-text">
                  <span className="reserve-form-essential">*</span>
                  보관은 최대 30일까지 가능합니다.
                </span>
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
              style={{ opacity: isFormFilled ? 1 : 0.5, cursor: isFormFilled ? "pointer" : "not-allowed" }}
              onClick={handleNext}
            >보관 예약서 작성 완료</button>
          </div>

        </div>
      </motion.div>
    </>
  )
};