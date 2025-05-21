import "./index.scss";
import {
  Checkbox,
  CheckboxGroupProps,
  DatePicker,
  DatePickerProps,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
  PasswordProps,
  Radio,
  RadioGroupProps,
  Select,
  SelectProps,
  FormItemProps,
  Form,
} from "formik-antd";
import { Property } from "csstype";
import { FormikFieldProps } from "formik-antd/lib/FieldProps";
import { TextAreaProps } from "antd/lib/input";
import { TextAreaRef } from "antd/lib/input/TextArea";
import { FormProps } from "antd";

function InputFormikGlobal(props: InputProps) {
  return (
    <Input {...props} className={`input-formik-global ${props.className}`} />
  );
}

function InputPasswordFormikGlobal(props: FormikFieldProps & PasswordProps) {
  return <Input.Password {...props} className="input-formik-global" />;
}

function InputNumberFormikGlobal(props: InputNumberProps) {
  const parseInteger = (value?: string): number => {
    if (!value && value !== "0") {
      return 0;
    }
    const newValue = value.replace(/,/g, "");
    return parseInt(newValue, 10);
  };

  return (
    <InputNumber
      className={`input-number-formik-global ${props.className}`}
      formatter={(value): string =>
        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      parser={parseInteger}
      {...props}
    />
  );
}

function SelectFormikGlobal(props: SelectProps) {
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
      {...props}
      className={`select-formik-global ${props.className}`}
    />
  );
}

interface InputTextAreaProps {
  height?: number;
  resize?: Property.Resize | undefined;
}

function TextAreaFormikGlobal(
  props: FormikFieldProps &
    TextAreaProps &
    InputTextAreaProps &
    React.RefAttributes<TextAreaRef>,
) {
  const { readOnly, height, resize = "none" } = props;
  return (
    <Input.TextArea
      {...props}
      className={`${
        readOnly ? "input-formik-global-read-only" : "input-formik-global"
      } ${props.className}`}
      style={{
        height: height,
        width: "100%",
        resize: resize,
      }}
    />
  );
}

function DatePickerFormikGlobal(props: DatePickerProps) {
  return (
    <DatePicker
      {...props}
      className={`date-picker-formik-global ${props.className}`}
    />
  );
}

function CheckboxGroupFormikGlobal(props: CheckboxGroupProps) {
  return (
    <Checkbox.Group
      {...props}
      className={`check-box-group-formik-global ${props.className}`}
    />
  );
}

function RadioGroupFormikGlobal(props: RadioGroupProps) {
  return (
    <Radio.Group
      {...props}
      className={`radio-group-formik-global ${props.className}`}
    />
  );
}

function FormItemGlobal(props: FormItemProps): JSX.Element {
  return (
    <Form.Item hasFeedback {...props}>
      {props.children}
    </Form.Item>
  );
}

export default function FormGlobal(props: FormProps): JSX.Element {
  return <Form layout="vertical" {...props} />;
}

export {
  InputFormikGlobal,
  InputPasswordFormikGlobal,
  InputNumberFormikGlobal,
  SelectFormikGlobal,
  TextAreaFormikGlobal,
  DatePickerFormikGlobal,
  CheckboxGroupFormikGlobal,
  RadioGroupFormikGlobal,
  FormItemGlobal,
};
