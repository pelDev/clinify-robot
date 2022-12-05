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
    "\n  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {\n    createInvoice(createInvoiceInput: $createInvoiceInput) {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n": types.SaveNewInvoiceDocument,
    "\n  query GetInvoices {\n    invoices {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n": types.GetInvoicesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvoice($id: Int!) {\n    getInvoice(id: $id) {\n      id\n      from {\n        email\n      }\n      to {\n        email\n      }\n      created_at\n      due_date\n      amount\n      terms\n      description\n    }\n  }"): (typeof documents)["\n  query GetInvoice($id: Int!) {\n    getInvoice(id: $id) {\n      id\n      from {\n        email\n      }\n      to {\n        email\n      }\n      created_at\n      due_date\n      amount\n      terms\n      description\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {\n    createInvoice(createInvoiceInput: $createInvoiceInput) {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation saveNewInvoice($createInvoiceInput: CreateInvoiceInput!) {\n    createInvoice(createInvoiceInput: $createInvoiceInput) {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvoices {\n    invoices {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"): (typeof documents)["\n  query GetInvoices {\n    invoices {\n      id\n      from {\n        name\n      }\n      due_date\n      amount\n      status\n    }\n  }\n"];

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