const swRegister = () => {
  //    ↱ 서비스워커 사용 가능하다면
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", { scope: '/' })  // dist 안에 빌드 되는 것 기준
      .then((registration) => {
        console.log("서비스워커 등록 성공", registration);
      })
      .catch((error) => {
        console.error("서비스워커 등록 실패: ", error);
      });
  }
}

export default swRegister;