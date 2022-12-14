import { FormEvent, useEffect, useState } from "react";
import "./invoice.style.scss";
import { useMutation, useQuery } from "@apollo/client";
import Input from "../../input/input.component";
import { formatDateToYYYMMDD } from "../../../utils/helpers";
import SelectButton from "../../select-button/select-button.component";
import Button from "../../button/button.component";
import {
  CREATE_INVOICE,
  GET_INVOICE,
  GET_INVOICES,
  UPDATE_INVOICE,
} from "../../../queries";
import { toast } from "react-toastify";
import CustomTable from "../../custom-table/custom-table.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

interface InvoiceFormProps {
  closeForm: () => void;
  selectedInvoiceId?: number | null;
}

const terms = ["Next 30 Days", "Next 90 Days"];

interface ItemInput {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceFormType {
  from: string;
  to: string;
  description: string;
  createdDate: Date;
  amount: number;
  saveAsDraft: boolean;
  selectedTerms: string;
  items: ItemInput[];
}

const tableHead = {
  name: "Item name",
  quantity: "Qty",
  price: "Price",
  total: "Total",
  action: "",
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  closeForm,
  selectedInvoiceId = null,
}) => {
  const { loading, data } = useQuery(GET_INVOICE, {
    variables: { id: selectedInvoiceId || -1 },
  });

  const [form, setForm] = useState<InvoiceFormType>({
    from: "",
    to: "",
    description: "",
    createdDate: new Date(),
    amount: 0,
    saveAsDraft: false,
    selectedTerms: "",
    items: [],
  });

  const onChange = (name: string, value: any) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const [createInvoice, { loading: creatingInvoice }] = useMutation(
    CREATE_INVOICE,
    {
      variables: {
        createInvoiceInput: {
          ...form,
          terms: form.selectedTerms,
        },
      },
    }
  );

  const [updateInvoice, { loading: updatingInvoice }] = useMutation(
    UPDATE_INVOICE,
    {
      variables: {
        updateInvoiceInput: {
          id: selectedInvoiceId || -1,
          terms: form.selectedTerms,
          description: form.description,
          amount: form.amount,
        },
      },
    }
  );

  const getSelectedIndexTerms = () => {
    if (!terms) return "";

    const idx = terms.indexOf(form.selectedTerms);

    return idx;
  };

  const getSelectedIndexDraft = () => {
    if (form.saveAsDraft) return 0;
    else return 1;
  };

  useEffect(() => {
    if (data) {
      onChange("from", data.getInvoice.from.email);
      onChange("to", data.getInvoice.to.email);
      onChange("description", data.getInvoice.description);
      onChange("createdDate", new Date(data.getInvoice.created_at));
      onChange("selectedTerms", data.getInvoice.terms);
      onChange("amount", data.getInvoice.amount);
    }
  }, [data]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedInvoiceId) {
      createInvoice({
        onCompleted: () => {
          toast("Invoice created successfully", {
            type: "success",
          });
          closeForm();
        },
        onError: (error) => {
          toast(error.message, { type: "error" });
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
    } else {
      updateInvoice({
        onCompleted: () => {
          toast("Invoice updated successfully");
          closeForm();
        },
        onError: (error) => {
          toast(error.message, { type: "error" });
        },
      });
    }
  };

  const handleClose = () => {
    if (creatingInvoice || updatingInvoice) return;

    closeForm();
  };

  const headRow = () => {
    return Object.keys(tableHead).map((key, index) => (
      <td key={index}>
        <span>{(tableHead as Record<string, any>)[key]}</span>
      </td>
    ));
  };

  const handleRemoveItem = (index: number) => () => {
    setForm((prev) => {
      const v = { ...prev };

      v.items = v.items.slice(0, index).concat(v.items.slice(index + 1));

      return v;
    });
  };

  const tableRows = (rowData: { item: ItemInput; index: number }) => {
    const { item, index } = rowData;

    const tableCell = Object.keys(tableHead);

    const columnData = tableCell.map((keyD, i) => {
      if (keyD === "name") {
        return (
          <td key={i}>
            <Input
              id={"item-input-" + index + i}
              type="text"
              value={form.items[index]?.name || ""}
              label=""
              required
              setValue={(val) =>
                setForm((prev) => {
                  const v = { ...prev };

                  v.items[index].name = val;

                  return v;
                })
              }
            />
          </td>
        );
      }

      if (keyD === "price" || keyD === "quantity") {
        return (
          <td key={i}>
            <Input
              id={"item-input-" + index + i}
              type="number"
              value={
                form.items[index] ? form.items[index][keyD].toString() : ""
              }
              label=""
              required
              min={1}
              setValue={(val) =>
                setForm((prev) => {
                  const v = { ...prev };

                  v.items[index][keyD] = +val;

                  return v;
                })
              }
            />
          </td>
        );
      }

      if (keyD === "total") {
        return <td key={i}>{item.price * item.quantity}</td>;
      }

      if (keyD === "action") {
        return (
          <td key={i}>
            <button
              type="button"
              className="delete-button"
              onClick={handleRemoveItem(index)}
            >
              <FontAwesomeIcon
                icon={solid("trash")}
                className="icon"
                size="1x"
              />
            </button>
          </td>
        );
      }

      return <td key={i}>{(item as Record<string, any>)[keyD]?.toString()}</td>;
    });

    return <tr key={index}>{columnData}</tr>;
  };

  const tableData = () => {
    return form.items.map((e, index) => tableRows({ item: e, index }));
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
          value={form.from}
          required
          setValue={(v) => onChange("from", v)}
          id="fromEmail"
        />

        <Input
          label="Bill to"
          type="email"
          value={form.to}
          required
          setValue={(v) => onChange("to", v)}
          id="toEmail"
        />

        <Input
          label="Invoice date"
          type="date"
          value={formatDateToYYYMMDD(form.createdDate)}
          setValue={() => {}}
          required
          id="invoiceDate"
          disabled
        />

        <SelectButton
          label="Payment terms"
          selected={getSelectedIndexTerms()}
          onSelect={(val) => onChange("selectedTerms", val)}
          defaultValue="Payment terms"
          showDefault
          options={terms}
          id="paymentTerms"
          required
        />

        <Input
          label="Project description"
          type="text"
          value={form.description}
          setValue={(val) => onChange("description", val)}
          required
          id="descriptiom"
        />

        <Input
          label="Amount"
          type="number"
          value={form.amount.toString()}
          setValue={(e: string) => onChange("amount", +e)}
          required
          min={0}
          id="amount"
        />

        {!selectedInvoiceId && (
          <SelectButton
            label="Save as draft?"
            selected={getSelectedIndexDraft()}
            onSelect={(e) => onChange("saveAsDraft", e === "Yes")}
            options={["Yes", "No"]}
            id="saveAsDraft"
            required
          />
        )}

        <div className="table-container">
          <span className="title">Items</span>

          <CustomTable headRow={headRow} tableData={tableData}>
            <col style={{ width: "33.75%" }} />
            <col style={{ width: "18.75%" }} />
            <col style={{ width: "18.75%" }} />
            <col style={{ width: "18.75%" }} />
            <col style={{ width: "10%" }} />
          </CustomTable>

          <Button
            title="Add New Item"
            type="button"
            variant="secondary"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                items: [...prev.items, { name: "", price: 0, quantity: 0 }],
              }))
            }
          />
        </div>

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
            disabled={creatingInvoice || updatingInvoice}
          />
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
