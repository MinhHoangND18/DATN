import { fetcher } from './Fetcher';

export interface ProductVariant {
  color: string;
  price: number;
  stock: number;
  image: File;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category_id?: number;
  variants: ProductVariant[];
}

function list(params?: Query): Promise<DataListResponse<any>> {
  return fetcher({ url: '/product', method: 'get', params });
}

function create(data: FormData) {
  return fetcher({ url: '/product', method: 'post', data }, { isFormData: true });
}

function update({ id, data }: { id: number; data: any }) {
  return fetcher(
    {
      url: `/product/${id}`,
      method: 'put',
      data,
    },
    { isFormData: true },
  );
}

function active({ id, active }: { id: string; active: boolean }): Promise<string> {
  return fetcher({
    url: `/product/${id}/active`,
    method: 'patch',
    data: { active },
  });
}

export default {
  list,
  create,
  update,
  active,
};
