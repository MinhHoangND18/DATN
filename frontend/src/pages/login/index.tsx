import ApiUser, { ILoginBody } from "@/api/ApiUser";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputPasswordFormikGlobal,
} from "@/components/FormGlobal";
import { loginUser } from "@/redux/slices/UserSlice";
import { LoginValidation } from "@/utils/validation/login";
import { useMutation } from "@tanstack/react-query";
import { Spin } from "antd";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const loginMutation = useMutation(ApiUser.login);

  const handleLogin = (values: ILoginBody): void => {
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (res: any) => {
          console.log(res);

          dispatch(loginUser({ ...res }));
          window.location.replace("/");
        },
      }
    );
  };

  return (
    <Spin tip="Loading..." size="large" spinning={loginMutation.isLoading}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginValidation}
        onSubmit={handleLogin}
      >
        {({ handleSubmit }): JSX.Element => (
          <section className="flex flex-col md:flex-row h-[90vh] items-center w-[90%]">
            <div className="hidden lg:block w-full md:w-1/2 xl:w-2/3 h-[80%] !flex items-center justify-center">
              <img
                src="https://cotat.vn/wp-content/uploads/2024/06/logo-ctt-ngang-03-time-skip-355b465042.png"
                alt=""
                className="w-[70%] object-cover"
              />
            </div>

            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
              <div className="w-full h-100">
                <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
                  Đăng nhập tài khoản
                </h1>

                <FormGlobal
                  className="mt-6"
                  method="POST"
                  onFinish={handleSubmit}
                >
                  <FormItemGlobal name="email" label="Tài khoản" required>
                    <InputFormikGlobal
                      name="email"
                      placeholder="Nhập tài khoản"
                    />
                  </FormItemGlobal>

                  <div className="mt-4">
                    <FormItemGlobal name="password" label="Mật khẩu" required>
                      <InputPasswordFormikGlobal
                        name="password"
                        placeholder="Nhập mật khẩu"
                      />
                    </FormItemGlobal>
                  </div>

                  <div className="text-right mt-2">
                    <a
                      href="#"
                      className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                    >
                      Quên mật khẩu
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                  >
                    Đăng nhập
                  </button>
                </FormGlobal>

                <hr className="my-6 border-gray-300 w-full" />

                {/* <div className="flex justify-between w-full">
                  <Link
                    type="button"
                    className="w-[45%] block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
                    to={"#"}
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        className="w-6 h-6"
                        viewBox="0 0 48 48"
                      >
                        <defs>
                          <path
                            id="a"
                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                          />
                        </defs>
                        <clipPath id="b">
                          <use xlinkHref="#a" overflow="visible" />
                        </clipPath>
                        <path
                          clipPath="url(#b)"
                          fill="#FBBC05"
                          d="M0 37V11l17 13z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#EA4335"
                          d="M0 11l17 13 7-6.1L48 14V0H0z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#34A853"
                          d="M0 37l30-23 7.9 1L48 0v48H0z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#4285F4"
                          d="M48 48L17 24l-4-3 35-10z"
                        />
                      </svg>
                      <span className="ml-4">Google</span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="w-[45%] block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.302 4.084 9.664 9.299 9.979V15.27H8.625V12h2.674V9.329c0-2.64 1.563-4.108 3.994-4.108 1.156 0 2.468.206 2.468.206v2.715h-1.393c-1.373 0-1.798.855-1.798 1.732V12h3.059l-.488 3.27h-2.57V21.98C17.916 21.635 22 17.302 22 12z"></path>
                      </svg>
                      <span className="ml-4">Facebook</span>
                    </div>
                  </button>
                </div> */}

                <p className="mt-8">
                  Chưa có tài khoản?{" "}
                  <Link
                    to={"/register"}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Đăng ký tại đây
                  </Link>
                </p>
              </div>
            </div>
          </section>
        )}
      </Formik>
    </Spin>
  );
};

export default Login;