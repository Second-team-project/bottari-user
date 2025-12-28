// sessionStorage 유틸리티
// localStorage와 동일한 API, 브라우저 탭 닫으면 자동 삭제

const RESERVE_KEY = 'bottari_reserve';

// 예약 데이터 저장
export const saveReserveSession = (data) => {
  try {
    sessionStorage.setItem(RESERVE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('sessionStorage 저장 실패:', error);
  }
};

// 예약 데이터 불러오기
export const getReserveSession = () => {
  try {
    const data = sessionStorage.getItem(RESERVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('sessionStorage 불러오기 실패:', error);
    return null;
  }
};

// 예약 데이터 삭제
export const clearReserveSession = () => {
  try {
    sessionStorage.removeItem(RESERVE_KEY);
  } catch (error) {
    console.error('sessionStorage 삭제 실패:', error);
  }
};
