import store from '@/redux/store';
import { fetcher } from './Fetcher';
import { IGetCustomersParams } from './ApiCustomer';
import { ERole } from '@/lazyLoading';

export enum EGender {
  Male = 'Nam',
  Female = 'Nữ',
  Other = 'Khác',
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody {
  username: string;
  email: string;
  password: string;
  gender: string;
  date_of_birth: string;
}

export interface ILoginRes {
  id?: number;
  email?: string;
  name?: string;
  address?: string;
  phone?: string;
  role?: ERole;
  accessToken?: string;
  active?: true;
  avatar?: string;
  first_login?: boolean;
}

export interface IUser {
  email?: string;
  username: string;
  address: string;
  phone: string;
  role: ERole;
  accessToken: string;
  birthday: string;
  refreshToken: string;
  active: true;
  avatar: string;
  cccd: string;
  password: string;
  full_name: string;
  gender: string;
  id?: number;
}

export interface ICreateUser {
  email: string;
  username: string;
  role: ERole;
  password: string;
  id?: number;
  full_name: string;
  cccd: string;
  gender: EGender;
  birthday: string;
  phone: string;
}

function login(data: any): Promise<IUser> {
  return fetcher({ url: 'auth/login-user', method: 'post', data }, { isXWWWForm: true });
}

function getUser(params?: IGetCustomersParams): Promise<DataListResponse<IUser>> {
  return fetcher({ url: 'user', method: 'get', params });
}

function createUser(data: ICreateUser): Promise<IUser> {
  return fetcher({ url: 'user', method: 'post', data });
}

function updateUser(payload: any): Promise<IUser> {
  const { id, data } = payload;

  const { username, password, role, ...rest } = data;

  return fetcher({
    url: 'user/' + id,
    method: 'put',
    data: rest,
  });
}

function activeUser(data: any): Promise<string> {
  const { id, ...rest } = data;
  return fetcher({ url: 'user/active/' + id, method: 'patch', data: rest });
}

function uploadAvatar(data: any): Promise<string> {
  const { id, file } = data;
  console.log('vao day', data);

  return fetcher(
    { url: 'user/upload-avatar/' + id, method: 'patch', data: file },
    { isFormData: true },
  );
}

function getAuthToken(): string | undefined {
  const { user } = store.getState();
  return user?.accessToken;
}

function isLogin(): boolean {
  return !!getAuthToken();
}

function checkMail(data: any): Promise<IUser[]> {
  return fetcher({ url: 'customer/mail', method: 'post', data });
}

function getMe(): Promise<IUser> {
  return fetcher({ url: 'auth/get-me', method: 'get' });
}

function active({ id, active }: { id: string; active: boolean }): Promise<string> {
  return fetcher({
    url: `/user/${id}`,
    method: 'patch',
    data: { active },
  });
}

function register(data: IRegisterBody): Promise<ILoginRes> {
  return fetcher({ url: 'auth/register', method: 'post', data }, { isXWWWForm: true });
}

export default {
  login,
  isLogin,
  checkMail,
  getMe,
  getUser,
  createUser,
  updateUser,
  activeUser,
  active,
  register,
  uploadAvatar,
};
