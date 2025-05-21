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
  return fetcher({ url: '/product/client', method: 'get', params });
}

function view(params?: Query): Promise<any> {
  return fetcher({ url: '/product/views', method: 'get', params });
}

function buy(params?: Query): Promise<any> {
  return fetcher({ url: '/product/buy', method: 'get', params });
}

function recommend(params?: Query): Promise<any> {
  return fetcher({ url: '/product/recommend', method: 'get', params });
}

function get(id?: string): Promise<any> {
  return fetcher({ url: '/product/' + id, method: 'get' });
}

function getClient(id?: string): Promise<any> {
  return fetcher({ url: '/product/' + id + '/client', method: 'get' });
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

function getRelated(id: string | number): Promise<Array<any>> {
  return fetcher({ url: '/product/related/' + id, method: 'get' });
}

function getRelatedClient(id: string | number): Promise<Array<any>> {
  return fetcher({ url: '/product/related-client/' + id, method: 'get' });
}

export default {
  list,
  create,
  update,
  active,
  get,
  getClient,
  view,
  buy,
  recommend,
  getRelated,
  getRelatedClient,
};
