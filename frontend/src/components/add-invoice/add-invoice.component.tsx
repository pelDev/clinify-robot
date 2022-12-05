import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./add-invoice.style.scss";

interface AddInvoiceProps {
  onClick: () => void;
}

const AddInvoice: React.FC<AddInvoiceProps> = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      <FontAwesomeIcon icon={solid("circle-plus")} className="icon" size="2x" />

      <span>New Invoice</span>
    </button>
  );
};

export default AddInvoice;
