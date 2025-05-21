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
        href: '/thong-ke',
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
        // refresh same router
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

    return getItem(
      item.title,
      item.id,
      Icon,
      child,
      undefined,
      undefined,
    );
  })?.filter((it: any) => it?.children?.length > 0);

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
    // <div
    //   className={classNames("sidebar", {
    //     ["sidebar-open"]: isOpen,
    //     ["sidebar-close"]: !isOpen,
    //   })}
    // >
    //   <Link className="flex items-center justify-center my-5" to="/">
    //     {/* <div className="bg-white rounded-full">
    //       <Avatar
    //         src={
    //           ""
    //         }
    //         size="large"
    //         alt="hotel"
    //         className="object-cover bg-[#121212]"
    //       />
    //     </div>
    //     {isOpen && (
    //       <h4 className="transition-all duration-300 text-white ml-4 text-xl mb-0">
    //         Hotel Management
    //       </h4>
    //     )} */}
    //   </Link>
    //   <Menu
    //     selectedKeys={selectedKey}
    //     defaultSelectedKeys={selectedKey}
    //     defaultOpenKeys={selectedKey}
    //     mode="inline"
    //     theme="dark"
    //     inlineCollapsed={!isOpen}
    //     items={itemsMenu}
    //     onClick={handleClickItemMenu}
    //   />
    // </div>
  );
}

export default Sidebar;
