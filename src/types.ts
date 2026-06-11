export type DocumentType = 'QUOTATION' | 'INVOICE' | 'RECEIPT';

export interface Entity {
  name: string;
  address: string;
  taxId: string;
  phone: string;
  email: string;
  branch?: string;
  contactPerson?: string;
  logo?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unitPrice2?: number;
  amount?: number;
}

export interface ColumnSettings {
  price1Label: string;
  showPrice2: boolean;
  price2Label: string;
  amountLabel?: string;
}

export interface DocumentData {
  type: DocumentType;
  documentNumber: string;
  date: string;
  dueDate: string;
  from: Entity;
  to: Entity;
  items: LineItem[];
  columnSettings?: ColumnSettings;
  paymentTerms?: string;
  notes: string;
  additionalDetails?: string;
  discount: number;
  taxRate: number;
  includeTax: boolean;
  themeColor?: string;
  fontFamily?: string;
}
