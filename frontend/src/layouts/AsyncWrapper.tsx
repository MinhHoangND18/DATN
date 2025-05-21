import { Spin, Alert } from "antd";

function AsyncWrapper(props: AsyncWrapperProps) {
  if (props.loading) {
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    );
  } else if (props.error) {
    return (
      <Alert
        message="Error"
        description={JSON.stringify(props.error)}
        type="error"
        showIcon
      />
    );
  } else if (props.fulfilled) {
    return props.children;
  } else {
    return <>Something has happen</>;
  }
}

AsyncWrapper.defaultValue = {
  loading: true,
  fulfilled: false,
  error: null,
  children: <></>,
};

export default AsyncWrapper;
