import Notification from '@/components/Notification';
import store from '@/redux/store';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface IFetcherOptions {
  token?: string;
  withToken?: boolean;
  displayError?: boolean;
  isXWWWForm?: boolean;
  isFormData?: boolean;
}

export interface IResponseDTOWithMetaData<T> {
  data: T;
  errorCode: string;
  message: string;
  success: boolean;
}

export interface IDataError {
  errorCode: string;
  message: string;
}

const baseURL = 'http://localhost:8081/api/v1';

function handleError(dataError: IDataError) {
  try {
    const { message } = dataError;
    Notification.notificationError(message);
  } catch (e) {
    console.warn(e);
    Notification.notificationError('Something is wrong. Please try again');
  }
}

export function fetcher<T>(
  config: AxiosRequestConfig,
  options?: IFetcherOptions,
) {
  const defaultOptions: IFetcherOptions = {
    displayError: true,
    isFormData: false,
    isXWWWForm: false,
    withToken: true,
    ...options,
  };

  const apiClient = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': defaultOptions.isFormData
        ? 'multipart/form-data'
        : defaultOptions.isXWWWForm
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
    },
  });

  if (defaultOptions.token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${defaultOptions.token}`;
  } else if (defaultOptions.withToken) {
    const state = store.getState();
    const token = state.user?.accessToken;
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  return new Promise<T>((resolve, reject) => {
    apiClient
      .request<T, AxiosResponse<IResponseDTOWithMetaData<T>>>(config)
      .then(async (response) => {
        if (response.data.success) {
          if (response.data.data === undefined) {
            const dataEmpty: IDataError = {
              errorCode: 'ERROR???',
              message: 'Data is empty',
            };
            if (defaultOptions.displayError) {
              handleError(dataEmpty);
            }
            reject(dataEmpty);
            return;
          }
          resolve(response.data.data);
          return;
        }
        const dataError: IDataError = {
          errorCode: response.data.errorCode ?? 'ERROR???',
          message: response.data.message ?? 'Somethings Wrong',
        };

        if (defaultOptions.displayError) {
          handleError(dataError);
        }
        reject(dataError);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const somethingsWrong: IDataError = {
            errorCode: 'ERROR???',
            message: 'Somethings Wrong',
          };

          if (defaultOptions.displayError) {
            handleError(somethingsWrong);
          }
        }
        reject(error);
      });
  });
}

export async function downloadFile({
  url,
  params,
  fileName,
  type,
  open,
}: {
  url: string;
  params?: any;
  fileName?: string;
  type?: string;
  open?: boolean;
}): Promise<unknown> {
  const apiClient = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const state = store.getState();
  const token = state.user?.accessToken;
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve, reject) => {
    apiClient
      .request<unknown, AxiosResponse<Blob>>({
        url: url,
        method: 'GET',
        responseType: 'blob',
        params: params,
      })
      .then((response) => {
        const blobType = type ? `application/${type}` : response.data.type;
        const href = window.URL.createObjectURL(
          new Blob([response.data], { type: blobType }),
        );

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${fileName ?? url}.${type ?? 'xlsx'}`);
        document.body.appendChild(link);
        link.click();

        if (open) {
          window.open(href);
        }
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
        Notification.notificationSuccess('file đang được tải xuống');

        resolve('OK');
      })
      .catch((e) => {
        if (e.response.config.url.includes('/bill')) {
          Notification.notificationSuccess(
            'Không có dữ liệu thống kê trong khoảng thời gian này!',
          );
        } else Notification.notificationSuccess('Tải xuống thất bại');
        reject();
      });
  });
}
