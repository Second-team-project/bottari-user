import "./ReserveStorage.css";

export default function ReserveStorage() {
  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="reserve-delivery-container">
        {/* 페이지 제목 */}
        <div className="reserve-delivery-title-wrapper page-title-wrapper">
          <h2 className="reserve-delivery-title">보따리 맡기기</h2>
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
                <span className="reserve-delivery-content-name">이름 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">이메일 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">휴대폰 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">비밀번호 :</span>
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
                <span className="reserve-delivery-content-name">맡길 날짜 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">찾을 날짜 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">보관하는 곳 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">보따리 종류 :</span>
                <input type="text" className="reserve-delivery-content-input" />
              </div>
              <div className="reserve-delivery-content">
                <span className="reserve-delivery-content-name">요청사항 :</span>
                <textarea type="text" className="reserve-delivery-content-input" rows="2"></textarea>
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