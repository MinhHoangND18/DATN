import { checkPermission, ERole } from "@/lazyLoading";
import "./index.scss";
import { Layout, Menu, MenuProps } from "antd";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: string | React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  roles?: ERole[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    className: `menu-item-${key}`,
    roles,
  } as MenuItem;
}

type TRouteSidebar = Array<{
  id: string;
  title: string;
  icon?: React.ReactElement;
  children: Array<{
    id: string;
    title: string;
    href: string;
    roles: ERole[]
  }>;
}>;

const ROUTE_SIDEBAR: TRouteSidebar = [
  {
    id: 'sub1',
    title: 'Tổng quan',
    icon: < RxDashboard />,
    children: [
      {
        id: 'sub1-1',
        title: 'Thống kê',
        href: '/',
        roles: [ERole.SUPER_ADMIN]
      },
    ],
  },
  {
    id: 'sub3',
    title: 'Quản lý đơn hàng',
    icon: <CiCalendar />,
    children: [
      {
        id: 'sub3-1',
        title: 'Danh sách đơn hàng',
        href: '/order',
        roles: [ERole.SUPER_ADMIN, ERole.SALE]
      },
    ],
  },

  {
    id: 'sub5',
    title: 'Quản lý hành vi người dùng',
    icon: <CiCalendar />,
    children: [
      {
        id: 'sub5-1',
        title: 'Hành vi người dùng',
        href: '/user-behavior',
        roles: [ERole.SUPER_ADMIN]
      },
    ],
  },
  {
    id: 'sub4',
    title: 'Danh mục',
    icon: <IoHomeOutline />,
    children: [
      {
        id: 'sub4-1',
        title: 'Danh mục nhân viên',
        href: '/user',
        roles: [ERole.SUPER_ADMIN]
      },
      {
        id: 'sub4-2',
        title: 'Danh mục sản phẩm',
        href: '/product',
        roles: [ERole.SUPER_ADMIN, ERole.SALE]
      },
      {
        id: 'sub4-3',
        title: 'Danh mục loại sản phẩm',
        href: '/category',
        roles: [ERole.SUPER_ADMIN, ERole.SALE]
      },
    ],
  },
]

export const useFormatSidebar = () => {
  return ROUTE_SIDEBAR.map((it) => {
    const children = it.children.filter((child) => checkPermission(child.roles));
    return {
      ...it,
      children,
    };
  }).filter((it) => it.children.length > 0);
};

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = `/${location.pathname?.split('/')[1]}`;

  const sidebarItems: MenuItem[] = ROUTE_SIDEBAR.map((item) => {
    const child = item.children
      .map((child) => {
        return getItem(
          <Link
            to={child.href || '/'}
            onClick={(e) => {
              e.preventDefault();
              navigate(child.href || '/', { state: Math.random() });
            }}
          >
            {child.title}
          </Link>,
          child.id,
          undefined,
          undefined,
          undefined,
          child.roles,
        );
      })
      .filter((v: any) => checkPermission(v?.roles));

    const Icon = item.icon;

    if (child.length === 1 && child[0] && 'roles' in child[0]) {
      const singleChild = child[0];
      const childHref = item.children[0]?.href || '/';

      return getItem(
        <Link
          to={childHref}
          onClick={(e) => {
            e.preventDefault();
            navigate(childHref, { state: Math.random() });
          }}
        >
          {item.children[0]?.title}
        </Link>,
        item.children[0]?.id || '',
        Icon,
        undefined,
        undefined,
        item.children[0]?.roles,
      );
    }

    return getItem(
      item.title,
      item.id,
      Icon,
      child,
      undefined,
      undefined,
    );
  })?.filter((it: any) => it?.children?.length > 0 || it?.key);

  const formatSidebar = useFormatSidebar();

  const defaultOpenKeys = formatSidebar.find((item) => {
    return item?.children.find((child) => {
      return child.href === pathName;
    });
  });

  const defaultSelectedKeys = defaultOpenKeys?.children.find((item) => {
    return item.href === pathName;
  });

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      theme='light'
      width={250}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint='md'
      style={{ borderRight: '1px solid #bebebe' }}
    >

      <Menu
        defaultOpenKeys={defaultOpenKeys?.id ? [defaultOpenKeys.id] : []}
        defaultSelectedKeys={defaultSelectedKeys?.id ? [defaultSelectedKeys.id] : []}
        theme='light'
        mode='inline'
        items={sidebarItems}
      />
    </Layout.Sider>
  );
}

export default Sidebar;
