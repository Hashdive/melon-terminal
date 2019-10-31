import React from 'react';
import NoMatch from '~/components/Routes/NoMatch/NoMatch';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import * as S from './WalletOverview.styles';
import { useAccountBalancesQuery } from '~/queries/AccountBalances';

export const WalletOverview: React.FC = () => {
  const [balances, query] = useAccountBalancesQuery();
  if (query.loading) {
    return <Spinner positioning="centered" size="large" />;
  }

  if (!balances) {
    return <NoMatch />;
  }

  return (
    <S.WalletOverviewBody>
      <S.WalletOverviewTitle>Balances</S.WalletOverviewTitle>
      <S.WalletOverviewBalances>
        {balances.eth && (
          <S.WalletOverviewBalance>
            <S.WalletOverviewBalanceLabel>ETH</S.WalletOverviewBalanceLabel>
            <S.WalletOverviewBalanceValue>{balances.eth.toFixed(8)}</S.WalletOverviewBalanceValue>
          </S.WalletOverviewBalance>
        )}
        {balances.weth && (
          <S.WalletOverviewBalance>
            <S.WalletOverviewBalanceLabel>WETH</S.WalletOverviewBalanceLabel>
            <S.WalletOverviewBalanceValue>{balances.weth.toFixed(8)}</S.WalletOverviewBalanceValue>
          </S.WalletOverviewBalance>
        )}
      </S.WalletOverviewBalances>
      <S.WalletOverviewTitle>Fund</S.WalletOverviewTitle>
      <S.WalletOverviewFundActions>
        <S.WalletOverviewFundAction to="/setup">Setup your fund</S.WalletOverviewFundAction>
      </S.WalletOverviewFundActions>
    </S.WalletOverviewBody>
  );
};

export default WalletOverview;
