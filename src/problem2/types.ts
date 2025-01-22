export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  symbol: string;
  name: string;
  price: number;
  icon: string;
} 