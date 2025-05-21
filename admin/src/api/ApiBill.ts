import { fetcher } from './Fetcher';

export enum BillStatus {
  pending = 'Chờ xác nhận',
  confirm = 'Đã tiếp nhận đơn',
  shipping = 'Đang giao hàng',
  success = 'Giao thành công',
  cancel = 'Đã huỷ đơn',
  other = 'Đơn hoàn/Khách không nhận',
}

function list(params: Query): Promise<DataListResponse<any>> {
  return fetcher({
    url: 'bill',
    method: 'get',
    params,
  });
}

function update({ id, status }: any) {
  return fetcher({
    url: `bill/${id}`,
    method: 'patch',
    data: { status },
  });
}

export default { list, update };
