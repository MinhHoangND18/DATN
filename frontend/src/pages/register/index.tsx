import ApiUser, { EGender, ILoginBody, ILoginRes, IRegisterBody } from "@/api/ApiUser";
import FormGlobal, {
    DatePickerFormikGlobal,
    FormItemGlobal,
    InputFormikGlobal,
    InputPasswordFormikGlobal,
    SelectFormikGlobal,
} from "@/components/FormGlobal";
import { loginUser } from "@/redux/slices/UserSlice";
import { RegisterValidation } from "@/utils/validation/login";
import { useMutation } from "@tanstack/react-query";
import { Col, Row, Spin } from "antd";
import { Formik } from "formik";
import moment from "moment";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const registerMutation = useMutation(ApiUser.register);

    const handleRegister = (values: IRegisterBody): void => {
        registerMutation.mutate(
            {
                email: values.email,
                password: values.password,
                username: values.username,
                gender: values.gender,
                date_of_birth: moment(values.date_of_birth).format('DD/MM/YYYY')
            },
            {
                onSuccess: (res: any) => {
                    dispatch(loginUser({ ...res }));
                    window.location.replace("/");
                },
            }
        );
    };

    return (
        <Spin tip="Loading..." size="large" spinning={registerMutation.isLoading}>
            <Formik
                initialValues={{ email: "", password: "", username: "", date_of_birth: '', gender: '' }}
                validationSchema={RegisterValidation}
                onSubmit={handleRegister}
            >
                {({ handleSubmit }): JSX.Element => (
                    <section className="flex flex-col md:flex-row h-[90vh] items-center w-[90%]">
                        <div className="hidden lg:block w-full md:w-1/2 xl:w-1/2 h-[80%] !flex items-center justify-center">
                            <img
                                src="https://cotat.vn/wp-content/uploads/2024/06/logo-ctt-ngang-03-time-skip-355b465042.png"
                                alt=""
                                className="w-[60%] object-cover"
                            />
                        </div>

                        <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/2 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
                            <div className="w-full h-100">
                                <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 text-center">
                                    Đăng ký tài khoản
                                </h1>

                                <FormGlobal
                                    className="mt-6"
                                    method="POST"
                                    onFinish={handleSubmit}
                                >
                                    <Row gutter={33}>
                                        <Col span={12}>
                                            <FormItemGlobal
                                                name="username"
                                                label="Tên người dùng"
                                                required
                                            >
                                                <InputFormikGlobal
                                                    name="username"
                                                    placeholder="Nhập tên người dùng"
                                                />
                                            </FormItemGlobal>

                                            <FormItemGlobal
                                                name="date_of_birth"
                                                label="Ngày sinh"
                                                required
                                            >
                                                <DatePickerFormikGlobal
                                                    name="date_of_birth"
                                                />
                                            </FormItemGlobal>

                                            <FormItemGlobal name="password" label="Mật khẩu" required>
                                                <InputPasswordFormikGlobal
                                                    name="password"
                                                    placeholder="Nhập mật khẩu"
                                                />
                                            </FormItemGlobal>
                                        </Col>
                                        <Col span={12}>
                                            <FormItemGlobal name="email" label="Email" required>
                                                <InputFormikGlobal
                                                    name="email"
                                                    placeholder="user@example.com"
                                                />
                                            </FormItemGlobal>
                                            <FormItemGlobal name="gender" label="Giới tính" required>
                                                <SelectFormikGlobal
                                                    name="gender"
                                                    options={Object.values(EGender).map(v => ({ value: v, label: v }))}
                                                />
                                            </FormItemGlobal>

                                            <FormItemGlobal
                                                name="re-password"
                                                label="Nhập lại mật khẩu"
                                                required
                                            >
                                                <InputPasswordFormikGlobal
                                                    name="re-password"
                                                    placeholder="Nhập lại mật khẩu"
                                                />
                                            </FormItemGlobal>
                                        </Col>
                                    </Row>

                                    <button
                                        type="submit"
                                        className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                                    >
                                        Đăng ký
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
                                    Đã có tài khoản?{" "}
                                    <Link
                                        to={"/login"}
                                        className="text-blue-500 hover:text-blue-700 font-semibold"
                                    >
                                        Đăng nhập
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

export default Register;