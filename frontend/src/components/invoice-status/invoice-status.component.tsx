import React from "react";
import { useTheme } from "../../hooks/useTheme";
import "./invoice-status.style.scss";

export type InvoiceStatusValues = "Paid" | "Draft" | "Pending";

interface InvoiceStatusProps {
  status: InvoiceStatusValues;
}

const InvoiceStatus: React.FC<InvoiceStatusProps> = ({ status }) => {
  const theme = useTheme();

  return (
    <div
      className={`invoice-status ${status.toLowerCase()} invoice-status__${theme}`}
    >
      <div className="dot" />
      <span>{status}</span>
    </div>
  );
};

export default InvoiceStatus;
