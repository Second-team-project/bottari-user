import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// ===== slices
import { setStorageReserve } from "../../store/slices/reserveSlice.js";
import { setDeliveryReserve } from "../../store/slices/reserveSlice.js";
// ===== utils
import { debounce } from "../../utils/debounceUtil.js";
import { handlePhone } from "../../utils/handlePhone.js";
import { handleEmail } from "../../utils/handleEmail.js";

/**
 * 예약 페이지 공통 - 내 정보 입력 섹션
 * @param {Object} props
 * @param {'STORAGE' | 'DELIVERY'} props.type - 예약 타입
 * @param {string} props.password - 비밀번호 (비회원용)
 * @param {function} props.setPassword - 비밀번호 setter
 * @param {string} props.passwordChk - 비밀번호 확인 (비회원용)
 * @param {function} props.setPasswordChk - 비밀번호 확인 setter
 */
export default function UserInfoSection({
  type,
  password,
  setPassword,
  passwordChk,
  setPasswordChk
}) {
  const dispatch = useDispatch();

  // ===== redux states
  const savedData = useSelector(state =>
    type === 'STORAGE' ? state.reserve.storageReserve : state.reserve.deliveryReserve
  );
  const user = useSelector(state => state.auth.user);

  // ===== 개인 정보 설정용
  const [name, setName] = useState(savedData?.userName || user?.userName || '');

  const { p1, p2, p3 } = handlePhone(savedData?.phone || user?.phone);
  const [phone1, setPhone1] = useState(p1);
  const [phone2, setPhone2] = useState(p2);
  const [phone3, setPhone3] = useState(p3);

  // ===== 이메일 설정용
  const { id: initEmailId, domain: initEmailDomain } = handleEmail(savedData?.email || user?.email);
  const [emailId, setEmailId] = useState(initEmailId);
  const [emailDomain, setEmailDomain] = useState(initEmailDomain || 'naver.com');
  const [isDomainInput, setIsDomainInput] = useState(false);

  // ===== savedData 최신값 참조용 (무한루프 방지)
  const savedDataRef = useMemo(() => ({ current: savedData }), []);
  useEffect(() => {
    savedDataRef.current = savedData;
  }, [savedData]);

  // ========================
  // ||     휴대폰 번호     ||
  // ========================
  const handlePhone2 = e => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setPhone2(value);
    }
  };
  const handlePhone3 = e => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setPhone3(value);
    }
  };

  // ===================
  // ||     이메일     ||
  // ===================
  const handleDomainSelect = e => {
    const value = e.target.value;
    if (value === 'type') {
      setEmailDomain('');
      setIsDomainInput(true);
    } else {
      setIsDomainInput(false);
      setEmailDomain(value);
    }
  };

  // ==========================
  // ||     Redux 저장       ||
  // ==========================
  const saveToRedux = useMemo(() => {
    return debounce((userInfoData) => {
      const updatedData = {
        ...savedDataRef.current,
        ...userInfoData,
      };

      if (type === 'STORAGE') {
        dispatch(setStorageReserve(updatedData));
      } else {
        dispatch(setDeliveryReserve(updatedData));
      }
      console.log(`${type} 예약 - 내 정보 redux 저장:`, userInfoData);
    }, 1000);
  }, [dispatch, type]);

  useEffect(() => {
    const phone = (phone2 && phone3) ? `${phone1}${phone2}${phone3}`.trim() : '';

    saveToRedux({
      userName: name.trim(),
      email: `${emailId}@${emailDomain}`.trim(),
      phone: phone,
    });
  }, [name, emailId, emailDomain, phone1, phone2, phone3, saveToRedux]);


  return (
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
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => setName(e.target.value.trim())}
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
        
        {/* 비회원일 경우 비밀번호 입력 */}
        {
          !user && (
            <>
              {/* 비밀번호 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">비밀번호 :</label>
                <input type="password" className="reserve-form-content-input"
                  placeholder="4글자 이상 입력 해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => setPassword(e.target.value.trim())}
                />
              </div>
              {/* 비밀번호 확인 */}
              <div className="reserve-form-content">
                <span className="reserve-form-essential">*</span>
                <label className="reserve-form-content-name">비밀번호 확인 :</label>
                <input type="password" className="reserve-form-content-input"
                  placeholder="비밀번호 한 번 더 입력"
                  value={passwordChk}
                  onChange={(e) => setPasswordChk(e.target.value)}
                  onBlur={(e) => setPasswordChk(e.target.value.trim())}
                />
              </div>
              {/* 안내문구 */}
              <div className="reserve-form-content-notice">
                <span className="reserve-form-content-notice-text">
                  <span className="reserve-form-essential">*</span>
                  비밀번호는 예약을 조회할 때 사용됩니다.
                </span>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
