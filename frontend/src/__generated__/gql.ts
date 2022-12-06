/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query GetInvoice($id: Int!) {\n    getInvoice(id: $id) {\n      id\n      from {\n        email\n      }\n      to {\n        email\n      }\n      created_at\n      due_date\n      amount\n      terms\n      description\n    }\n  }": types.GetInvoiceDocument,
    "\n  query GetInvoices {\n    invoices {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n": types.GetInvoicesDocument,
    "\n  query GetInvoiceDetails($id: Int!) {\n    getInvoice(id: $id)\n    {\n      id\n      from {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      to {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      amount\n    }\n  }\n": types.GetInvoiceDetailsDocument,
    "\n  mutation updateInvoice($updateInvoiceInput: UpdateInvoiceInput!) {\n    updateInvoice(updateInvoiceInput: $updateInvoiceInput){\n      id\n      from {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      to {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      due_date\n      terms\n      amount\n      description\n      status\n    }\n  }\n": types.UpdateInvoiceDocument,
    "\n  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {\n    createInvoice(createInvoiceInput: $createInvoiceInput) {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n": types.SaveNewInvoiceDocument,
    "\n  mutation deleteInvoiceById($id: Int!) {\n    removeInvoice(id: $id) {\n      id\n    }\n  }\n": types.DeleteInvoiceByIdDocument,
    "\n  mutation markInvoiceAsPaid($id: Int!) {\n    markAsPaid(id: $id) {\n      id,\n      status\n    }\n  }\n": types.MarkInvoiceAsPaidDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvoice($id: Int!) {\n    getInvoice(id: $id) {\n      id\n      from {\n        email\n      }\n      to {\n        email\n      }\n      created_at\n      due_date\n      amount\n      terms\n      description\n    }\n  }"): (typeof documents)["\n  query GetInvoice($id: Int!) {\n    getInvoice(id: $id) {\n      id\n      from {\n        email\n      }\n      to {\n        email\n      }\n      created_at\n      due_date\n      amount\n      terms\n      description\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvoices {\n    invoices {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"): (typeof documents)["\n  query GetInvoices {\n    invoices {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvoiceDetails($id: Int!) {\n    getInvoice(id: $id)\n    {\n      id\n      from {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      to {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      amount\n    }\n  }\n"): (typeof documents)["\n  query GetInvoiceDetails($id: Int!) {\n    getInvoice(id: $id)\n    {\n      id\n      from {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      to {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      amount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateInvoice($updateInvoiceInput: UpdateInvoiceInput!) {\n    updateInvoice(updateInvoiceInput: $updateInvoiceInput){\n      id\n      from {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      to {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      due_date\n      terms\n      amount\n      description\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation updateInvoice($updateInvoiceInput: UpdateInvoiceInput!) {\n    updateInvoice(updateInvoiceInput: $updateInvoiceInput){\n      id\n      from {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      to {\n        name\n        street\n        city\n        postcode\n        country\n        email\n      }\n      due_date\n      terms\n      amount\n      description\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {\n    createInvoice(createInvoiceInput: $createInvoiceInput) {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {\n    createInvoice(createInvoiceInput: $createInvoiceInput) {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteInvoiceById($id: Int!) {\n    removeInvoice(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation deleteInvoiceById($id: Int!) {\n    removeInvoice(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation markInvoiceAsPaid($id: Int!) {\n    markAsPaid(id: $id) {\n      id,\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation markInvoiceAsPaid($id: Int!) {\n    markAsPaid(id: $id) {\n      id,\n      status\n    }\n  }\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;