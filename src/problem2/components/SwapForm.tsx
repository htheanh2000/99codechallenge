import React, { useState, useEffect } from 'react';
import { Token, TokenPrice } from '../types';
import { fetchTokenPrices } from '../utils/api';

export default function SwapForm() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [swapStatus, setSwapStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

  useEffect(() => {
    const loadTokens = async () => {
      const prices = await fetchTokenPrices();
      const validTokens = prices
        .filter(price => price.price > 0)
        .map(price => ({
          symbol: price.currency,
          name: price.currency,
          price: price.price,
          icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${price.currency}.svg`
        }));
      setTokens(validTokens);
    };
    loadTokens();
  }, []);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (fromToken && toToken && value) {
      const exchangeRate = toToken.price / fromToken.price;
      setToAmount((parseFloat(value) * exchangeRate).toFixed(6));
    }
  };

  const handleSwap = async () => {
    if (!fromAmount || !fromToken || !toToken) return;
    
    setIsLoading(true);
    setSwapStatus('idle');

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSwapStatus('success');
      // Reset form
      setFromAmount('');
      setToAmount('');
      
      // Show success message for 2 seconds then reset
      setTimeout(() => {
        setSwapStatus('idle');
      }, 2000);
    } catch (error) {
      setSwapStatus('error');
      // Reset error state after 2 seconds
      setTimeout(() => {
        setSwapStatus('idle');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Swapping...';
    if (swapStatus === 'success') return 'Swap Successful!';
    if (swapStatus === 'error') return 'Swap Failed';
    if (!fromToken || !toToken) return 'Select tokens';
    if (!fromAmount) return 'Enter amount';
    return 'Swap';
  };

  const getButtonStyles = () => {
    const baseStyles = "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
    
    if (isLoading) {
      return `${baseStyles} bg-blue-400 text-white cursor-wait`;
    }
    if (swapStatus === 'success') {
      return `${baseStyles} bg-green-500 text-white`;
    }
    if (swapStatus === 'error') {
      return `${baseStyles} bg-red-500 text-white`;
    }
    if (!fromAmount || !fromToken || !toToken) {
      return `${baseStyles} bg-gray-400 text-white cursor-not-allowed`;
    }
    return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700`;
  };

  const CustomSelect = ({ 
    value, 
    onChange, 
    isOpen, 
    setIsOpen, 
    label 
  }: { 
    value: Token | null, 
    onChange: (token: Token) => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    label: string
  }) => (
    <div className="relative flex-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border rounded-lg bg-white cursor-pointer flex items-center justify-between"
      >
        {value ? (
          <div className="flex items-center gap-2">
            <img 
              src={value.icon} 
              alt={value.symbol} 
              className="w-6 h-6"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/24x24?text=' + value.symbol;
              }}
            />
            <span>{value.symbol}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select {label}</span>
        )}
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {tokens.map(token => (
            <div
              key={token.symbol}
              className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              onClick={() => {
                onChange(token);
                setIsOpen(false);
              }}
            >
              <img 
                src={token.icon} 
                alt={token.symbol} 
                className="w-6 h-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/24x24?text=' + token.symbol;
                }}
              />
              <span>{token.symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Swap Tokens</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="flex items-center gap-2">
            <CustomSelect
              value={fromToken}
              onChange={setFromToken}
              isOpen={isFromDropdownOpen}
              setIsOpen={setIsFromDropdownOpen}
              label="token"
            />
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="0.0"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="flex items-center gap-2">
            <CustomSelect
              value={toToken}
              onChange={setToToken}
              isOpen={isToDropdownOpen}
              setIsOpen={setIsToDropdownOpen}
              label="token"
            />
            <input
              type="number"
              value={toAmount}
              readOnly
              className="flex-1 p-2 border rounded-lg bg-gray-100"
              placeholder="0.0"
            />
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isLoading || !fromAmount || !fromToken || !toToken}
          className={getButtonStyles()}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {getButtonText()}
        </button>

        {swapStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg text-center">
            Successfully swapped {fromAmount} {fromToken?.symbol} to {toAmount} {toToken?.symbol}
          </div>
        )}

        {swapStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            Failed to swap tokens. Please try again.
          </div>
        )}
      </div>
    </div>
  );
} 