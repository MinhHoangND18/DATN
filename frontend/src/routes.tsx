import React, { useEffect } from "react";
import { ERole, PUBLIC_ROUTES } from "./lazyLoading";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd";
import AppLayout from './layouts'
import { useDispatch } from "react-redux";
import { disconnectSocket, initSocket } from "./redux/slices/SocketSlice";
import { useGetUserRedux } from "./redux/slices/UserSlice";

const Login = React.lazy(() => import("@/pages/login"));
const Register = React.lazy(() => import("@/pages/register"));
const PageNotFound = React.lazy(() => import("@/pages/404"));

const SuspenseWrapper = (props: SuspenseWrapperProps) => {
  return <React.Suspense fallback={<Spin />}>{props.children}</React.Suspense>;
};

function MainRoutes() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(initSocket());
  //   return () => {
  //     dispatch(disconnectSocket());
  //   };
  // }, [dispatch]);

  const user = useGetUserRedux()

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isNull = (object: Object) => {
    return Object.keys(object).length === 0
  }

  // useEffect(() => {
  //   if (isNull(user)) return navigate('/login')
  // }, [user, pathname])

  return (
    <Routes>
      <Route
        path="/login"
        key="/login"
        element={
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        }
      />
      <Route
        path="/register"
        key="/register"
        element={
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        }
      />
      <Route path="/" element={<AppLayout />}>
        {PUBLIC_ROUTES.map((route) => (
          <Route
            path={route.path}
            key={route.path}
            element={
              <SuspenseWrapper>
                <route.component />
              </SuspenseWrapper>
            }
          />
        ))}
      </Route>

      <Route
        path="*"
        key="*"
        element={
          <SuspenseWrapper>
            <PageNotFound />
          </SuspenseWrapper>
        }
      />
    </Routes>
  );
}

export default MainRoutes;
