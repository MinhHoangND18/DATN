import "./index.scss";
import { ReactNode } from "react";
import { Button } from "antd";

interface IButtonGlobalProps {
  title?: ReactNode;
  preIcon?: ReactNode;
  color?: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ButtonGlobal({
  title,
  color = "#1890ff",
  onClick,
  className,
  isLoading,
  disabled,
}: IButtonGlobalProps) {
  return (
    <Button
      className={`button-global ${className}`}
      style={{ background: color }}
      type="primary"
      onClick={onClick}
      loading={isLoading}
      disabled={disabled}
      color={color}
    >
      {title}
    </Button>
  );
}
