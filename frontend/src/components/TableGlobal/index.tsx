import "./index.scss";
import React from "react";
import { Table, TableProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import {
  ExpandableConfig,
  FilterValue,
  SorterResult,
  TableRowSelection,
} from "antd/lib/table/interface";
import { DefaultRecordType } from "rc-table/lib/interface";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";

export interface IChangeTable {
  page: number;
  pageSize: number;
  sorter?: SorterResult<DefaultRecordType>[];
  filters?: Record<string, FilterValue | null>;
}

interface ITableGlobalProps extends TableProps<DefaultRecordType> {
  total?: number;
  columns: ColumnsType<any>;
  rowSelection?: TableRowSelection<any>;
  expandable?: ExpandableConfig<any>;
  onChangeTable?: (value: IChangeTable) => void;
  scrollX?: number;
  subtractHeight?: number;
}

export const TABLE_DEFAULT_VALUE = {
  defaultPageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "15", "20"],
  showQuickJumper: true,
};

function TableGlobal({
  rowKey = "id",
  total,
  columns,
  rowSelection,
  expandable,
  onChangeTable,
  scrollX = 1000,
  subtractHeight,
  className,
  ...props
}: ITableGlobalProps) {
  const { height } = useWindowDimensions();

  const renderPagination = {
    ...TABLE_DEFAULT_VALUE,
    total: total ?? 0,
  };

  return (
    <Table
      showSorterTooltip={false}
      className={`table-global ${className}`}
      rowKey={rowKey}
      size="small"
      columns={columns}
      rowSelection={
        rowSelection
          ? { ...rowSelection, fixed: "left", columnWidth: 50 }
          : undefined
      }
      expandable={{
        columnWidth: 80,
        ...expandable,
      }}
      onChange={(page, filters, sorter) => {
        onChangeTable?.({
          page: page?.current ?? 1,
          pageSize: page?.pageSize ?? renderPagination.defaultPageSize,
          filters: filters,
          sorter: Array.isArray(sorter) ? sorter : [sorter],
        });
      }}
      pagination={renderPagination}
      scroll={{
        scrollToFirstRowOnChange: true,
        x: scrollX,
        y: subtractHeight ? height - subtractHeight : undefined,
      }}
      bordered
      {...props}
    />
  );
}

export default React.memo(TableGlobal);
