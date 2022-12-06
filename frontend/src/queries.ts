import { gql } from "./__generated__/gql";

export const GET_INVOICE = gql(`
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

export const GET_INVOICES = gql(`
  query GetInvoices {
    invoices {
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

export const GET_INVOICE_DETAILS = gql(`
  query GetInvoiceDetails($id: Int!) {
    getInvoice(id: $id)
    {
      id
      from {
        name
        street
        city
        postcode
        country
        email
      }
      to {
        name
        street
        city
        postcode
        country
        email
      }
      amount
    }
  }
`);

export const UPDATE_INVOICE = gql(`
  mutation updateInvoice($updateInvoiceInput: UpdateInvoiceInput!) {
    updateInvoice(updateInvoiceInput: $updateInvoiceInput){
      id
      from {
        name
        street
        city
        postcode
        country
        email
      }
      to {
        name
        street
        city
        postcode
        country
        email
      }
      due_date
      terms
      amount
      description
      status
    }
  }
`);

export const CREATE_INVOICE = gql(`
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

export const DELETE_INVOICE = gql(`
  mutation deleteInvoiceById($id: Int!) {
    removeInvoice(id: $id) {
      id
    }
  }
`);

export const MARK_AS_PAID = gql(`
  mutation markInvoiceAsPaid($id: Int!) {
    markAsPaid(id: $id) {
      id,
      status
    }
  }
`);
