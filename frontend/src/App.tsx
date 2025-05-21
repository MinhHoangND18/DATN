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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Helmet title="Có tất" />
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
