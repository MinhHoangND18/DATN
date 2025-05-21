import "./index.scss";
import { Input, Select, SelectProps } from "antd";
import { SearchProps } from "antd/lib/input";

function InputSearchGlobal({ className, ...props }: SearchProps): JSX.Element {
  return (
    <Input.Search
      allowClear
      placeholder="Tìm kiếm"
      className={`ant-search-global ${className}`}
      {...props}
    />
  );
}

function SelectGlobal({ className, ...props }: SelectProps) {
  return (
    <Select
      dropdownStyle={{
        borderRadius: "5px",
      }}
      allowClear
      showSearch
      filterOption={(inputValue, option): boolean =>
        String(option?.label)
          ?.toLowerCase()
          ?.includes(inputValue.toLowerCase())
      }
      className={`select-global ${className}`}
      {...props}
    />
  );
}

export { InputSearchGlobal, SelectGlobal };
