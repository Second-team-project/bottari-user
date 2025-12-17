import "./Loading.css";

export default function Loading() {
  return(
    <>
      {/* 전체 컨테이너 */}
      <div className="loading-container">
        {/* 페이지 제목 */}
        <div className="loading-title-wrapper">
          <h2 className="loading-title">불러오는 중...</h2>
        </div>
      </div>    
    </>
  )
}