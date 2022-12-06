import React, { useEffect, useState } from "react";
import InvoiceForm from "../../components/forms/invoice/invoice.form";
import { useTheme } from "../../hooks/useTheme";
import "./invoice.style.scss";
import { gql } from "../../__generated__/gql";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import Button from "../../components/button/button.component";
import {
  DELETE_INVOICE,
  GET_INVOICES,
  GET_INVOICE_DETAILS,
  MARK_AS_PAID,
} from "../../queries";

interface InvoicePageProps {}

const InvoicePage: React.FC<InvoicePageProps> = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const openInvoiceForm = () => setIsFormOpen(true);
  const closeInvoiceForm = () => setIsFormOpen(false);

  const [searchParams] = useSearchParams();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number>(-1);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setSelectedInvoiceId(+id);
  }, [searchParams]);

  const { loading, error, data } = useQuery(GET_INVOICE_DETAILS, {
    variables: { id: selectedInvoiceId },
  });

  const [deleteInvoice, { loading: deletingInvoice }] = useMutation(
    DELETE_INVOICE,
    {
      variables: {
        id: selectedInvoiceId,
      },
    }
  );

  const [markInvoiceAsPaid, { loading: updatingInvoice }] = useMutation(
    MARK_AS_PAID,
    {
      variables: {
        id: selectedInvoiceId,
      },
    }
  );

  const handleDelete = () => {
    if (selectedInvoiceId) {
      deleteInvoice({
        onCompleted: (data) => {
          console.log("Invoice deleted", data);
          navigate(-1);
        },
        onError: (error) => {
          console.log("Error deleting invoice", error.message);
        },
        update: (cache, { data }) => {
          const existingInvoices = cache.readQuery({
            query: GET_INVOICES,
          });

          if (existingInvoices && data) {
            const newInvoices = existingInvoices.invoices.filter(
              (e) => e.id !== data.removeInvoice.id
            );

            cache.writeQuery({
              query: GET_INVOICES,
              data: { invoices: newInvoices },
            });
          }
        },
      });
    }
  };

  const handleMarkAsPaid = () => {
    if (selectedInvoiceId) {
      markInvoiceAsPaid({
        onCompleted: (data) => {
          console.log("invoice updated", data);
          navigate(-1);
        },
      });
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={`invoice-page ${theme}`}>
      {isFormOpen && (
        <InvoiceForm
          closeForm={closeInvoiceForm}
          selectedInvoiceId={selectedInvoiceId}
        />
      )}

      <header>
        <Button
          title="Edit"
          variant="secondary"
          type="button"
          onClick={openInvoiceForm}
          disabled={deletingInvoice || updatingInvoice}
        />

        <Button
          title="Delete"
          variant="danger"
          type="button"
          onClick={handleDelete}
          disabled={deletingInvoice || updatingInvoice}
        />

        <Button
          title="Mark as Paid"
          variant="primary"
          type="button"
          onClick={handleMarkAsPaid}
          disabled={deletingInvoice || updatingInvoice}
        />
      </header>

      <div className="invoice-page__content">
        <div className="row from">
          <div>
            <p>{data?.getInvoice.from.street}</p>
            <p>{data?.getInvoice.from.city}</p>
            <p>{data?.getInvoice.from.postcode}</p>
            <p>{data?.getInvoice.from.country}</p>

            <div>
              <span>Sent to</span>
              <span>{data?.getInvoice.to.email}</span>
            </div>
          </div>
        </div>

        <div className="row to">
          <div>
            <div className="sent-from">
              <span>Sent from</span>
              <span>{data?.getInvoice.from.email}</span>
            </div>

            <p>{data?.getInvoice.to.street}</p>
            <p>{data?.getInvoice.to.city}</p>
            <p>{data?.getInvoice.to.postcode}</p>
            <p>{data?.getInvoice.to.country}</p>
          </div>
        </div>

        <div className="row amount">
          <span>${Number(data?.getInvoice.amount).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
