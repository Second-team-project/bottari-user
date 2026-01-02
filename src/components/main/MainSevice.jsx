import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "./MainService.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function MainService() {
  // ===== redux  states
  const serviceList = useSelector(state => state.guideImg.serviceList);
  const loading = useSelector(state => state.guideImg.loading);

  console.log('loading:', loading, 'serviceList:', serviceList);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
            <div className="main-service-img-container">
              {
                loading || !serviceList?.length ? (
                  <Skeleton height={500} width="100%" />
                ) : (
                  <img 
                    src={serviceList[0]?.img} 
                    alt="서비스 안내" 
                    className="main-service-img"
                  />
                )
              }
            </div>
      
    </motion.div>
  );
}