import React, { useMemo } from 'react';
import { BoxProps } from '@library/types'; // replace with actual library

// Proper type definitions
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

// Enum for blockchain priorities
enum BlockchainPriority {
  Osmosis = 100,
  Ethereum = 50,
  Arbitrum = 30,
  Zilliqa = 20,
  Neo = 20,
  Default = -99,
}

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances(); // Use a hook to get the balances
  const prices = usePrices(); // Use a hook to get the prices

  // Moved to a pure function outside component
  const getBlockchainPriority = (blockchain: string): number => 
    BlockchainPriority[blockchain as keyof typeof BlockchainPriority] ?? BlockchainPriority.Default;

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getBlockchainPriority(balance.blockchain);
        return balancePriority > BlockchainPriority.Default && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        return getBlockchainPriority(rhs.blockchain) - getBlockchainPriority(lhs.blockchain);
      })
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: prices[balance.currency] * balance.amount,
      }));
  }, [balances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance: FormattedWalletBalance) => (
        <WalletRow 
          key={`${balance.blockchain}-${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
          currency={balance.currency}
        />
      ))}
    </div>
  );
};

export default WalletPage; 