import { useNavigate } from "react-router-dom";
import "./Reserve.css";

export default function Reserve() {
  const navigate = useNavigate()

  function navReserveDelivery() {
    navigate('/Reserve/delivery');
  }
  function navReserveStorage() {
    navigate('/Reserve/storage');
  }


  return(
    <>
      <div className="reserve-page-container">

        <div className="reserve-btn-container" onClick={navReserveStorage}>
          {/* 맡기기 버튼 */}
          <div className="reserve-btn-storage">
            <p className="reserve-btn-storage-text">
              맡기기
            </p>
          </div>
          {/* 옮기기 버튼 */}
          <div className="reserve-btn-delivery" onClick={navReserveDelivery}>
            <p className="reserve-btn-delivery-text">
              옮기기
            </p>
          </div>


        </div>

      </div>

    
    </>
  )
}