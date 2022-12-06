import InvoiceStatus, {
  InvoiceStatusValues,
} from "../../../invoice-status/invoice-status.component";
import Card from "../../card.component";
import "./invoice.style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

interface InvoiceCardProps {
  status: InvoiceStatusValues;
  id: number;
  date: string;
  amount: number;
  from: string;
  onClick: VoidFunction;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  status,
  id,
  amount,
  date,
  from,
  onClick,
}) => {
  return (
    <div className="invoice-card" onClick={onClick}>
      <Card>
        <div className="desktop">
          <div className="item">
            <span>#</span>
            <span>{id}</span>
          </div>

          <div className="item">Due {date}</div>

          <div className="item">{from}</div>

          <div className="item">${Number(amount).toLocaleString()}</div>

          <div className="item">
            <InvoiceStatus status={status} />

            <FontAwesomeIcon
              icon={solid("angle-right")}
              size="sm"
              className="arrow-right"
            />
          </div>
        </div>

        <div className="mobile">
          <div className="row">
            <div>
              <span>#</span>
              <span>{id}</span>
            </div>

            <div>{from}</div>
          </div>

          <div className="row">
            <div>
              <span>Due {date}</span>
              <span>${Number(amount).toLocaleString()}</span>
            </div>

            <InvoiceStatus status={status} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceCard;
