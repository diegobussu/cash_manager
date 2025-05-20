export interface BankCard {
  id: number;
  user_id: number;
  card_number: string; // Will store last 4 digits only for security
  card_holder: string;
  expiry_date: string; // Format: MM/YY
  card_type: string; // Visa, Mastercard, etc.
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}
