import "./index.scss";
import { Button, Modal } from "antd";
import React, { ReactNode } from "react";

interface IModalGlobalProps {
  className?: string;
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
  title: string | boolean | React.ReactElement;
  children: JSX.Element;
  textOK?: string;
  textCancel?: string;
  isLoadingOK?: boolean;
  footer?: null | ReactNode;
  width?: string | number;
}

function ModalGlobal(props: IModalGlobalProps): JSX.Element {
  const {
    className,
    open,
    onOk,
    onCancel,
    title,
    children,
    textOK = "Xác nhận",
    textCancel = "Hủy",
    isLoadingOK = false,
    footer,
    width = "90vw",
  } = props;
  return (
    <Modal
      destroyOnClose
      className={`modal-global ${className}`}
      centered
      title={<div style={{ fontSize: "24px" }}>{title}</div>}
      width={width}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        footer === null
          ? false
          : footer || [
            <Button className="button-cancel" key="back" onClick={onCancel}>
              {textCancel}
            </Button>,
            <Button
              className="button-ok"
              key="submit"
              type="primary"
              htmlType="submit"
              loading={isLoadingOK}
              onClick={onOk}
            >
              {textOK}
            </Button>,
          ]
      }
    >
      <div className="modal-global_content custom-scrollbar">{children}</div>
    </Modal>
  );
}

export default ModalGlobal;
