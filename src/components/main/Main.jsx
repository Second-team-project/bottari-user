import "./Main.css";
import banner from "../../../public/main.jpg";

import BottariLogo2 from "../logo/BottariLogo2.jsx";


export default function Main() {
    
  return (
    <>
      <div className="main-banner-container">
        <div className="main-banner" style={{ backgroundImage: `url( ${banner} )` }}></div>
      </div>
      <div className="main-event-container">

      </div>
      <div className="main-bottari-preview-continer">
        
      </div>
    </>
  )

}