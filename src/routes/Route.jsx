import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 컴포넌트
import App from "../App.jsx";
import Main from "../components/main/Main.jsx";
import SocialLoginPage from "../components/login/SocialLoginPage.jsx";
// 예약 관련
import Reserve from "../components/reserve/Reserve.jsx";
import ReserveDelivery from "../components/reserve/ReserveDelivery.jsx";
import ReserveStorage from "../components/reserve/ReserveStorage.jsx";
import ReserveList from "../components/reserveList/ReserveList.jsx";
// 가이드
import Guide from "../components/guide/Guide.jsx";
import GuideUsage from "../components/guide/GuideUsage.jsx";
import GuidePrice from "../components/guide/GuidePrice.jsx";
// 후기
import Review from "../components/review/Review.jsx";
import ReviewDetail from "../components/review/ReviewDetail.jsx";
import ReviewCreate from "../components/review/ReviewCreate.jsx";
// 고객 센터
import Service from "../components/service/Service.jsx";
import FAQ from "../components/service/FAQ.jsx";
import Notice from "../components/service/Notice.jsx";
import NoticeDetail from "../components/service/NoticeDetail.jsx";
// 로그인 관련
import Social from "../components/auth/Social.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/login",
        element: <SocialLoginPage />,
      },
      {
        path: "/guide",
        element: <Guide />,
      },
      {
        path: "/guide/usage",
        element: <GuideUsage />,
      },
      {
        path: "/guide/price",
        element: <GuidePrice />,
      },
      {
        path: "/reserve",
        element: <Reserve />,
      },
      {
        path: "/reserve/delivery",
        element: <ReserveDelivery />,
      },
      {
        path: "/reserve/storage",
        element: <ReserveStorage />,
      },
      {
        path: "/reserve/list",
        element: <ReserveList />,
      },
      {
        path: "/review",
        element: <Review />,
      },
      {
        path: "/review/detail",
        element: <ReviewDetail />,
      },
      {
        path: "/review/create",
        element: <ReviewCreate />,
      },
      {
        path: "/service",
        element: <Service />,
      },
      {
        path: "/service/notice",
        element: <Notice />,
      },
      {
        path: "/service/notice/:id",
        element: <NoticeDetail />,
      },
      {
        path: "/service/faq",
        element: <FAQ />,
      },
    ],
  },
  {
    path: "/callback/social",
    element: <Social />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}