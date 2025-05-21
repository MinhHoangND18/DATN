import "./index.scss";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

function LayoutWrapper() {
  return (
    <Layout className='!min-h-screen'>
      <Navbar />
      <Layout className='flex'>
        <Sidebar />
        <Layout.Content className='flex-1 p-6'>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default LayoutWrapper;
