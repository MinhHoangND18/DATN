import "./index.scss";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "./Header";
import Footer from "./Footer";

function LayoutWrapper() {
  return (
    <Layout className='!min-h-screen'>
      <Header />
      <div className="flex justify-center">
        <div className="container"><Outlet /></div>
      </div>
      <Footer />
    </Layout>
  );
}

export default LayoutWrapper;
