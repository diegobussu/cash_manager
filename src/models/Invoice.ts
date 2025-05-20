export interface Invoice {
  id: number;
  user_id: number;
  card_number: string;
  total_price: number;
  created_at: Date;
  updated_at: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  bar_code: string;
  product_name: string;
  quantity: number;
}
