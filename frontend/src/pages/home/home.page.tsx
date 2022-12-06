import React, { useEffect, useState } from "react";
import InvoiceCard from "../../components/card/cards/invoice/invoice.card";
import { useTheme } from "../../hooks/useTheme";
import "./home.style.scss";
import { useQuery } from "@apollo/client";
import { InvoiceStatusValues } from "../../components/invoice-status/invoice-status.component";
import AddInvoice from "../../components/add-invoice/add-invoice.component";
import Select from "../../components/select/select.component";
import InvoiceForm from "../../components/forms/invoice/invoice.form";
import { useNavigate } from "react-router-dom";
import { GET_INVOICES } from "../../queries";

const statuses = ["All", "Paid", "Pending", "Draft"];

interface GetInvoiceData {
  __typename?: "Invoice" | undefined;
  id: number;
  due_date: string;
  amount: number;
  status: string;
  from: {
    __typename?: "User" | undefined;
    name: string;
  };
}

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const theme = useTheme();

  const { loading, error, data } = useQuery(GET_INVOICES);

  const [filtered, setFiltered] = useState<GetInvoiceData[]>([]);

  useEffect(() => {
    if (data) setFiltered(data.invoices);
  }, [data]);

  const filterInvoices = (value: string) => {
    if (!data) return;

    switch (value) {
      case "Paid":
        setFiltered(data.invoices.filter((e) => e.status === "Paid"));
        break;

      case "Pending":
        setFiltered(data.invoices.filter((e) => e.status === "Pending"));
        break;

      case "Draft":
        setFiltered(data.invoices.filter((e) => e.status === "Draft"));
        break;

      default:
        setFiltered(data.invoices);
        break;
    }
  };

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const openInvoiceForm = () => setIsFormOpen(true);
  const closeInvoiceForm = () => setIsFormOpen(false);

  const navigate = useNavigate();

  const handleInvoiceClick = (id: number) => () => {
    navigate(`/invoice?id=${id}`);
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={`home-page ${theme}`}>
      {isFormOpen && <InvoiceForm closeForm={closeInvoiceForm} />}

      <header>
        <div className="left">
          <h1>Invoices</h1>
          <span>There are {filtered.length} total invoices</span>
        </div>

        <div className="right">
          <Select options={statuses} selected={0} onSelect={filterInvoices} />

          <AddInvoice onClick={openInvoiceForm} />
        </div>
      </header>

      <div className="invoices">
        {filtered.map((invoice) => (
          <InvoiceCard
            key={`invoice-${invoice.id}`}
            id={invoice.id}
            date={invoice.due_date}
            from={invoice.from.name}
            amount={invoice.amount}
            status={invoice.status as InvoiceStatusValues}
            onClick={handleInvoiceClick(invoice.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
