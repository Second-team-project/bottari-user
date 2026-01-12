import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import "./MainBanner.css";

import { useSelector } from "react-redux";

export default function MainBanner() {
  // ===== redux states
  const bannerList = useSelector(state => state.guideImg.bannerList);
  const loading = useSelector(state => state.guideImg.loading);

  return (
      <div className="main-banner-container">
        {
          loading || !bannerList?.length ? (
            <Skeleton height={500} width="100%" />
          ) : (
            <div className="main-banner" style={{ backgroundImage: `url(${bannerList[0]?.img})` }}></div>

          )
        }
      </div>
      

  );
}