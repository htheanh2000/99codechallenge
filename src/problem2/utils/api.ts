import { TokenPrice } from '../types';

export async function fetchTokenPrices(): Promise<TokenPrice[]> {
  try {
    const response = await fetch('https://interview.switcheo.com/prices.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return [];
  }
} 