import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./ErrorBoundary";
import "./index.scss";
import "antd/dist/antd.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Helmet from "./components/Helmet";
import MainRoutes from "./routes";
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Cấu hình locale cho dayjs
dayjs.locale('vi');

// Cấu hình Ant Design sử dụng Dayjs
ConfigProvider.config({
  theme: {
    primaryColor: '#1890ff',
  },
});

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Helmet title="Quản lý bán hàng" />
            <MainRoutes />
            <ToastContainer />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </QueryClientProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
