import { Spin } from "antd";

function BackDropLoading({ loading = false }: { loading: boolean }) {
  return (
    <div
      style={{
        display: loading ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin />
    </div>
  );
}

export default BackDropLoading;
