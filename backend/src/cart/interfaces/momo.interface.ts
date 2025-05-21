export interface IResponseSuccessPayment {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: number;
  message: string;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  deeplinkWebInApp?: string;
}

export interface ICreatePayment {
  requestId: string;
  orderId: string;
  orderInfo: string;
  amount: number;
  orderType: string;
  transId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  redirectUrl: string;
  ipnUrl: string;
}

export interface IResponsePayment {
  requestId: string;
  orderId: string;
  message: string;
  localMessage: string;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
  deeplinkWebInApp: string;
}
