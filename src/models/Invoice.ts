export interface Invoice {
  id: number;
  user_id: number;
  total_price: number;
  createdAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  bar_code: string;
  product_name: string;
  quantity: number;
}
