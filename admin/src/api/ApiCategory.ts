import { fetcher } from './Fetcher';

export interface CreateCategoryPayload {
  name: string;
}

function list(params?: Query): Promise<DataListResponse<any>> {
  return fetcher({ url: '/category', method: 'get', params });
}

function create(data: CreateCategoryPayload) {
  return fetcher({ url: '/category', method: 'post', data });
}

function update({ id, data }: { id: number; data: any }) {
  return fetcher({
    url: `/category/${id}`,
    method: 'put',
    data,
  });
}

export default {
  list,
  create,
  update,
};
