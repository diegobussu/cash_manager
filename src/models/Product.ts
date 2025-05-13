export interface Product {
  id: number;
  bar_code: string;
  name: string;
  brand: string;
  ingredients?: string;
  energy?: number;
  fat?: number;
  saturated_fat?: number;
  carbohydrates?: number;
  sugars?: number;
  proteins?: number;
  salt?: number;
  manufacturing_country?: string;
  labels?: string;
  allergens?: string;
  additives?: string;
  image_url?: string;
  quantity?: number;
  created_at: Date;
  updated_at: Date;
}
