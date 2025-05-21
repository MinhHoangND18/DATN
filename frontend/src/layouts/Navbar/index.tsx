import { IRoute, PUBLIC_ROUTES } from "@/lazyLoading";
import "./index.scss";
import { Breadcrumb, Dropdown, Image, Layout, MenuProps, Space } from "antd";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser, reloadUser } from "@/redux/slices/UserSlice";
import store from "@/redux/store";
import { useIsFetching, useIsMutating, useQuery } from "@tanstack/react-query";
import ApiUser from "@/api/ApiUser";
import { IMAGE_USER_DEFAULT } from "@/const";

const findPath = (routes: IRoute[], path: string): IRoute[] | null => {
  for (const route of routes) {
    if (route.path === path) {
      return [route];
    }
  }
  return null;
};

interface IRenderBreadcrumbProps {
  path: string;
}

const RenderBreadcrumb = ({ path }: IRenderBreadcrumbProps) => {
  const pathArray = findPath(PUBLIC_ROUTES, path);
  if (!pathArray) {
    return null;
  }

  return (
    <Breadcrumb>
      {pathArray.map((route) => (
        <Breadcrumb.Item key={route.path}>{route.name}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = store.getState().user;
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();


  const { data: me } = useQuery(["get_me"], () => ApiUser.getMe());

  useEffect(() => {
    dispatch(reloadUser(me));
  }, [me]);

  const handleLogOut = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const dropdownItems: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Logout",
        onClick: handleLogOut,
      },
    ];
  }, []);

  return (
    <Layout.Header className="!px-4 !bg-white">
      <div className="navbar">
        <div className="flex items-center">
          <RenderBreadcrumb path={location.pathname} />
        </div>
        <Space>
          {isFetching + isMutating > 0 && (
            <div className="w-[40px] h-[40px]">
              <img src="/loading.svg" alt="" className="w-full h-full" />
            </div>
          )}
          <Dropdown menu={{ items: dropdownItems }}>
            <div className="cursor-pointer flex items-center gap-1">
              <Image
                className="rounded-full object-contain"
                width={35}
                height={35}
                src={
                  user.avatar ?? IMAGE_USER_DEFAULT
                }
                alt="user avatar"
                preview={false}
              />
              <span className="mr-20 ml-5">
                Xin chào <strong>{user.full_name}!</strong>
              </span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Layout.Header>
  );
}

export default Navbar;
