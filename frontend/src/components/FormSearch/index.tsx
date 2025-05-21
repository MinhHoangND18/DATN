import React from "react";
import { Select } from "antd";
import { useDebounceFn } from "ahooks";

import InputSelect from "../AntdGlobal";
import styles from './index.module.scss'
import { IPatient } from "@/api/ApiPatient";

interface IProps {
    value?: any;
    setValue: any;
    data?: IPatient[];
    runAsync: any;
    valueField?: number[];
    placeholder?: string;
    multiple?: boolean;
    id?: number;
}

const FormSearchEvent = ({
    data,
    value,
    placeholder,
    multiple = false,
    runAsync,
    setValue
}: IProps) => {

    const handleSearch = (value: string) => {
        // setValue(value);
        // runAsync()
    };

    return (
        <></>
    );
};

export default React.memo(FormSearchEvent);