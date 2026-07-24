import { Orientation, PageSize } from '@capawesome/capacitor-pdf-generator';

export type TemplateType = 'invoice' | 'certificate' | 'report' | 'receipt' | 'url';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface DocumentData {
  title: string;
  clientName: string;
  clientEmail?: string;
  serviceDescription: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  items: LineItem[];
  taxRatePercent?: number;
  discountPercent?: number;
  currencySymbol: string;
  notes?: string;
  orientation: Orientation;
  pageSize: PageSize;
  companyName: string;
  companyTagline?: string;
  timeout?: number;
}

export interface PdfDocumentRecord {
  id: string;
  title: string;
  templateType: TemplateType;
  path: string;
  fileName: string;
  createdAt: string;
  clientName: string;
  totalAmount: number;
  currencySymbol: string;
  pageSize: PageSize;
  orientation: Orientation;
  isWebFallback?: boolean;
}

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  category: string;
  description: string;
  icon: string;
  accentColor: string;
  badge: string;
}

export { Orientation, PageSize };
