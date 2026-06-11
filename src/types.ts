export type DocumentType = 'QUOTATION' | 'INVOICE' | 'RECEIPT';

export interface Entity {
  name: string;
  address: string;
  taxId: string;
  phone: string;
  email: string;
  branch?: string;
  contactPerson?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface DocumentData {
  type: DocumentType;
  documentNumber: string;
  date: string;
  dueDate: string;
  from: Entity;
  to: Entity;
  items: LineItem[];
  paymentTerms?: string;
  notes: string;
  discount: number;
  taxRate: number;
  includeTax: boolean;
}
