export interface IToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface ILoginData {
  username?: string;
  email?: string;
  password: string;
}

export interface IForgetPassword {
  email?: string;
  phone?: string;
  username?: string;
}

export interface IOTP {
  otp: number;
}
