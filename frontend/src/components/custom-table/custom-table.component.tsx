import React from "react";
import "./custom-table.style.scss";

interface CustomTableProps {
  headRow: () => JSX.Element[];
  tableData: () => JSX.Element[];
  children: JSX.Element[];
}

const CustomTable: React.FC<CustomTableProps> = ({
  headRow,
  tableData,
  children,
}) => {
  return (
    <table className="custom-table">
      {children}
      <thead>
        <tr>{headRow()}</tr>
      </thead>

      <tbody>{tableData()}</tbody>
    </table>
  );
};

export default CustomTable;
