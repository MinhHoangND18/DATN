import React from "react";
import { useGetUserRedux } from "./redux/slices/UserSlice";

export enum ERole {
  SALE = 'Quản lý bán hàng',
  SUPER_ADMIN = 'Quản trị hệ thống',
}


export function checkPermission(
  permissions: ERole[],
  permission?: (ERole | undefined)
) {
  const user = useGetUserRedux();
  if (!user) return false

  if (!permission) permission = user?.role
  if (permission) {
    return permissions.includes(permission);
  }
  return false;
}

export interface IRoute {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  name: string;
  roles?: string[];
}

const HomePage = React.lazy(() => import('@/pages/statistic'))
const ProductPage = React.lazy(() => import('@/pages/product-management/ProductManagement'))
const CategoryPage = React.lazy(() => import('@/pages/category-management'))
const OrderPage = React.lazy(() => import('@/pages/order-management'))
const UserPage = React.lazy(() => import('@/pages/user-management'))
const UserBehaviorPage = React.lazy(() => import('@/pages/user-behavior'))


export const PUBLIC_ROUTES: IRoute[] = [
  {
    name: 'Dashboard',
    component: HomePage,
    path: '/'
  },
  {
    name: 'Quản lý sản phẩm',
    component: ProductPage,
    path: '/product'
  },
  {
    name: 'Quản lý loại sản phẩm',
    component: CategoryPage,
    path: '/category'
  },
  {
    name: 'Quản lý nhân viên',
    component: UserPage,
    path: '/user'
  },
  {
    name: 'Quản lý đơn hàng',
    component: OrderPage,
    path: '/order'
  },
  {
    name: 'Quản lý hành vi người dùng',
    component: UserBehaviorPage,
    path: '/user-behavior'
  }
];
