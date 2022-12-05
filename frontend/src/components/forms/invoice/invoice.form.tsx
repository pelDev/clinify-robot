import { FormEvent, useEffect, useState } from "react";
import "./invoice.style.scss";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "../../../__generated__/gql";
import Input from "../../input/input.component";
import { formatDateToYYYMMDD } from "../../../utils/helpers";
import SelectButton from "../../select-button/select-button.component";
import Button from "../../button/button.component";
import { GET_INVOICES } from "../../../pages/home/home.page";

interface InvoiceFormProps {
  closeForm: () => void;
  selectedInvoiceId?: number | null;
}

const terms = ["Next 30 Days", "Next 90 Days"];

const GET_INVOICE = gql(`
  query GetInvoice($id: Int!) {
    getInvoice(id: $id) {
      id
      from {
        email
      }
      to {
        email
      }
      created_at
      due_date
      amount
      terms
      description
    }
  }`);

const CREATE_INVOICE = gql(`
  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {
    createInvoice(createInvoiceInput: $createInvoiceInput) {
      id
      from {
        name
      }
      due_date
      amount
      status
    }
  }
`);

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  closeForm,
  selectedInvoiceId = null,
}) => {
  const { loading, error, data, refetch } = useQuery(GET_INVOICE, {
    variables: { id: selectedInvoiceId || -1 },
  });

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<Date>(new Date());
  const [selectedTerms, setSelectedTerms] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [saveAsDraft, setSaveAsDraft] = useState<1 | 0>(0);

  const [createInvoice, { loading: creatingInvoice }] = useMutation(
    CREATE_INVOICE,
    {
      variables: {
        createInvoiceInput: {
          from,
          to,
          description,
          terms: selectedTerms,
          amount,
          saveAsDraft,
        },
      },
    }
  );

  const getSelectedIndexTerms = () => {
    if (!terms) return "";

    const idx = terms.indexOf(selectedTerms);

    return idx;
  };

  const getSelectedIndexDraft = () => {
    if (saveAsDraft === 1) return 0;
    else return 1;
  };

  useEffect(() => {
    if (data) {
      setFrom(data.getInvoice.from.email);
      setTo(data.getInvoice.to.email);
      setDescription(data.getInvoice.description);
      setCreatedDate(new Date(data.getInvoice.created_at));
      setSelectedTerms(data.getInvoice.terms);
      setAmount(data.getInvoice.amount);
    }
  }, [data]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createInvoice({
      onCompleted: (data) => {
        console.log("Invoice created", data);
        closeForm();
      },
      onError: (error) => {
        console.log("Error creating invoice", error.message);
      },
      update: (cache, { data }) => {
        const existingInvoices = cache.readQuery({
          query: GET_INVOICES,
        });

        if (existingInvoices && data) {
          const newInvoices = [
            ...existingInvoices.invoices,
            data.createInvoice,
          ];

          cache.writeQuery({
            query: GET_INVOICES,
            data: { invoices: newInvoices },
          });
        }
      },
    });
  };

  const handleClose = () => {
    if (creatingInvoice) return;

    closeForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={handleClose}
      className="invoice-form"
    >
      <div className="content" onClick={(e) => e.stopPropagation()}>
        <h1>
          {selectedInvoiceId ? `Edit #${selectedInvoiceId}` : "New Invoice"}
        </h1>

        <Input
          label="Bill from"
          type="email"
          value={from}
          required
          setValue={setFrom}
          id="fromEmail"
        />

        <Input
          label="Bill to"
          type="email"
          value={to}
          required
          setValue={setTo}
          id="toEmail"
        />

        <Input
          label="Invoice date"
          type="date"
          value={formatDateToYYYMMDD(createdDate)}
          setValue={() => {}}
          required
          id="invoiceDate"
          disabled
        />

        <SelectButton
          label="Payment terms"
          selected={getSelectedIndexTerms()}
          onSelect={setSelectedTerms}
          defaultValue="Payment terms"
          showDefault
          options={terms}
          id="paymentTerms"
          required
        />

        <Input
          label="Project description"
          type="text"
          value={description}
          setValue={setDescription}
          required
          id="descriptiom"
        />

        <Input
          label="Amount"
          type="number"
          value={amount.toString()}
          setValue={(e: string) => setAmount(+e)}
          required
          id="amount"
        />

        <SelectButton
          label="Save as draft?"
          selected={getSelectedIndexDraft()}
          onSelect={(e) => setSaveAsDraft(e === "Yes" ? 1 : 0)}
          options={["Yes", "No"]}
          id="saveAsDraft"
          required
        />

        <div className="actions">
          <Button
            title="Cancel"
            type="button"
            variant="secondary"
            onClick={handleClose}
          />

          <Button
            title={selectedInvoiceId ? "Save changes" : "Save"}
            type="submit"
            variant="primary"
            disabled={creatingInvoice}
          />
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
