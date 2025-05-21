import { MomoPayment } from 'momo-payment-api';
import {
  ICreatePayment,
  IRefundPayment,
  IResponsePayment,
  IResponseSuccessPayment,
} from 'momo-payment-api/src/type';

export class MomoPaymentService {
  private momoPayment: any;

  /**
   * @param partnerCode
   * @param accessKey
   * @param secretKey
   * @param enviroment = production -> live || development -> sanbox
   */
  constructor() {
    this.momoPayment = new MomoPayment(
      'MOMO',
      'F8BBA842ECF85',
      'K951B6PE1waDMi640xX08PD3vg6EkVlz',
      'development',
    );
  }

  async createPayment(input: ICreatePayment) {
    try {
      const result: IResponsePayment = await this.momoPayment.createPayment(input);

      // handle your code here

      return result;
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(input: IRefundPayment) {
    try {
      const result = await this.momoPayment.refundPayment(input);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // inpUrl: khi thanh toán thành công sẽ gọi vào api và trỏ tới service này
  async confirmPayment(body: IResponseSuccessPayment) {
    try {
      // handle your code here
    } catch (error) {
      throw error;
    }
  }
}
