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

const HomePage = React.lazy(() => import('@/pages/home'))
const Productpage = React.lazy(() => import('@/pages/product'))
const ProductDetailPage = React.lazy(() => import('@/pages/product/ProductDetail'))
const CartPage = React.lazy(() => import('@/pages/cart'))
const IntroducePage = React.lazy(() => import('@/pages/introduce'))
const ContactPage = React.lazy(() => import('@/pages/contact'))
const HistoryPage = React.lazy(() => import('@/pages/order-history'))
const ProfilePage = React.lazy(() => import('@/pages/profile'))

export const PUBLIC_ROUTES: IRoute[] = [
  {
    name: 'Trang chủ',
    component: HomePage,
    path: '/'
  },
  {
    name: 'Sản phẩm',
    component: Productpage,
    path: '/product'
  },
  {
    name: 'Sản phẩm',
    component: ProductDetailPage,
    path: '/product/:id'
  },
  {
    name: 'Giỏ hàng',
    component: CartPage,
    path: '/cart'
  },
  {
    name: 'Liên hệ',
    component: ContactPage,
    path: '/contact'
  },
  {
    name: 'Giới thiệu',
    component: IntroducePage,
    path: '/introduce'
  },
  {
    name: 'Giới thiệu',
    component: HistoryPage,
    path: '/history'
  },
  {
    name: 'Giới thiệu',
    component: ProfilePage,
    path: '/profile'
  },
];
