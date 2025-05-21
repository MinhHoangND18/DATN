// useCart.ts
import ApiCart, { CartItem } from '@/api/ApiCart';
import { useGetUserRedux } from '@/redux/slices/UserSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useCart = () => {
  const queryClient = useQueryClient();

  const user = useGetUserRedux();
  // Lấy dữ liệu từ server bằng useQuery
  const {
    data: serverCart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: ApiCart.get,
    enabled: !!user?.id,
  });

  // State cục bộ để quản lý giỏ hàng
  const [cartItems, setCartItems] = useState<CartItem[]>(serverCart?.cart_items || []);

  // Đồng bộ state cục bộ với server khi serverCart thay đổi
  useEffect(() => {
    if (serverCart?.cart_items) {
      setCartItems(serverCart.cart_items);
    }
  }, [serverCart]);

  // Thêm vào giỏ hàng
  const addToCartMutation = useMutation({
    mutationFn: ApiCart.addToCart,
    onSuccess: updatedCart => {
      setCartItems(updatedCart.cart_items); // Cập nhật state cục bộ
      queryClient.setQueryData(['cart'], updatedCart); // Cập nhật cache React Query
    },
  });

  // Xóa khỏi giỏ hàng
  const removeFromCartMutation = useMutation({
    mutationFn: ApiCart.removeFromCart,
    onSuccess: updatedCart => {
      setCartItems(updatedCart.cart_items);
      queryClient.setQueryData(['cart'], updatedCart);
    },
  });

  // Thanh toán
  const checkoutMutation = useMutation({
    mutationFn: ApiCart.checkout,
    onSuccess: () => {
      setCartItems([]); // Xóa state cục bộ
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // Làm mới từ server
    },
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.variant.product?.price ?? 0) * item.quantity,
    0,
  );

  return {
    cartItems,
    isLoading,
    error,
    addToCart: (variantId: number, quantity: number) =>
      addToCartMutation.mutate({ variantId, quantity }),
    removeFromCart: (cartItemId: number) => removeFromCartMutation.mutate(cartItemId),
    checkout: () => checkoutMutation.mutate(),
    totalPrice,
    totalItem: cartItems.length,
  };
};
