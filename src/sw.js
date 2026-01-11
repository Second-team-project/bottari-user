import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
      //  ↱ 네트워크 우선 요청 → timeout 캐싱 출력
      //                ↱ 우선 캐싱 → 백그라운드에서 네트워크 요청
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

const PREFIX = import.meta.env.VITE_APP_NAME;

// -----------------------------------------
// ||     SW 즉시 활성화 (새 버전 즉시 반영)
// -----------------------------------------
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// -----------------------------------------
// ||     채팅 페이지 상태 관리 (postMessage)
// -----------------------------------------
let isChatOpen = false;

self.addEventListener('message', (e) => {
  if (e.data.type === 'CHAT_OPEN') {
    isChatOpen = true;
  } else if (e.data.type === 'CHAT_CLOSE') {
    isChatOpen = false;
  }
});


// -----------------------------------------
// ||     정적 파일 캐싱 : 정적 파일, 이미지 등 html, css, js 캐싱
// -----------------------------------------
precacheAndRoute(self.__WB_MANIFEST);

// -----------------------------------------
// ||     HTML 오프라인 대응 : 실무에서는 주로 1초
// -----------------------------------------
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${PREFIX}-html-cache`,
      //                   ↱ 3초
    networkTimeoutSeconds: 3,
  })
);

// -----------------------------------------
// ||     이미지 캐싱 (manifest 제외)
// -----------------------------------------
registerRoute(
  ({request}) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: `${PREFIX}-image-cache`,
  })
);

// -----------------------------------------
// ||     API 요청 캐싱 (최소 동작 보장, GET만 추천 - 나머지 제외)
// -----------------------------------------
// registerRoute(
//   ({request, url}) => {
//     const isMyApi = url.origin === import.meta.env.VITE_SERVER_URL && request.method === 'GET';
//     // 제외 백엔드 라우트
//     const isExcluded = url.pathname.includes('/reserve') || url.pathname.includes('/pricing');
//     return isMyApi && !isExcluded;
//   },
//   new StaleWhileRevalidate({
//     cacheName: `${PREFIX}-api-cache`,
//   })
// );

// -----------------------------------------
// ||     웹 푸시 핸들러
// -----------------------------------------
self.addEventListener('push', e => {
  const data = e.data.json();

  // 채팅 페이지 열려있으면 알림 생략
  if (isChatOpen) {
    return;
  }

  e.waitUntil(
    self.registration.showNotification(
      data.title,
      {
        body: data.message,
        icon: '/icons/bottari-icon.png',
        data: {
          targetUrl: data.data.targetUrl
        }
      }
    )
  );
})

// -----------------------------------------
// ||     웹 푸시 클릭 이벤트
// -----------------------------------------
// 웹 푸시의 이벤트는 하나 뿐 : 알림 클릭
self.addEventListener('notificationclick', e => {
  // 1. 푸시 창 닫기
  e.notification.close(); 

  // 2. 페이로드에서 백엔드가 전달한 전체 URL 추출 (웹 푸시 핸들러에서 받음)
  const openUrl = e.notification.data.targetUrl;

  // 3. Origin 획득 : 접속 도메인
  const origin = self.location.origin;

  //  ↱ 작업이 끝날 때까지 서비스워커 기다림
  e.waitUntil(
    // clients의 구조
    // [
    //  //  ↱ 브라우저 탭 하나
    //   WindowClient = {
    //     focused: false,
    //     frameType: "top-level",
    //     id: "f6e4c645-16ba-4ebe-9600-443b91141742",
    //     type: "window",
    //     url: "http://localhost:3000/posts",
    //     visibilityState: "visible"
    //   },
    //   // ...
    // ]
    //                       ↱ 브라우저 탭     ↱ sw가 업데이트로 관리 대상에서 제외된 경우도 포함
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(clients => {
      // 앱에서 루트 도메인 탭이 있는지 확인         ↱ 도메인이 같은 탭 찾음 
      const myClient = clients.find(client => client.url.startsWith(origin));

      // 4-1. 재활용할 탭이 있다면 포커스 및 네이베이트 처리 
      if(myClient) {
        myClient.focus();
        return myClient.navigate(openUrl);
      }

      // 4-2. 재활용할 탭이 없다면 새창으로 열기
      if(self.clients.openWindow) {
        return self.clients.openWindow(openUrl);
      }
    })
  );
})