import { EGender } from "./ApiUser";
import { fetcher } from "./Fetcher";

export interface IGetCustomersParams {
  page?: number;
  limit?: number;
  sort?: string[];
  search?: string;
}

export interface ICustomerRes {
  id: string;
  username: string;
  address: string;
  gender: EGender;
  email: string;
  phone: string;
  note: string;
  cccd: string;
}

export interface IGetCustomersRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: ICustomerRes[];
}

const getCustomers = (
  params?: IGetCustomersParams
): Promise<IGetCustomersRes> => {
  return fetcher({ method: "get", url: "/customer", params });
};
export default {
  getCustomers,
};
