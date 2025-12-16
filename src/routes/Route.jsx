import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 컴포넌트
import App from "../App.jsx";
import Main from "../components/main/Main.jsx";
import Login from "../components/login/login.jsx";

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
        element: <Login />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}