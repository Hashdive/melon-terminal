import React, { useMemo } from 'react';
import { useFundInvestQuery } from '~/queries/FundInvest';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import RequestInvestment from './RequestInvestment/RequestInvestment';
import ExecuteRequest from './ExecuteRequest/ExecuteRequest';
import CancelRequest from './CancelRequest/CancelRequest';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { RequiresFundCreatedAfter } from '~/components/Gates/RequiresFundCreatedAfter/RequiresFundCreatedAfter';

export interface FundInvestProps {
  address: string;
}

export const FundInvest: React.FC<FundInvestProps> = ({ address }) => {
  const [result, query] = useFundInvestQuery(address);

  const account = result?.account;
  const allowedAssets = result?.fund?.routes?.participation?.allowedAssets;
  const action = useMemo(() => {
    const canCancelRequest = result?.account?.participation?.canCancelRequest;
    if (canCancelRequest) {
      return 'cancel';
    }

    const investmentRequestState = result?.account?.participation?.investmentRequestState;
    if (investmentRequestState === 'VALID') {
      return 'execute';
    }

    if (investmentRequestState === 'WAITING') {
      return 'waiting';
    }

    if (investmentRequestState === 'NONE') {
      return 'invest';
    }
  }, [result]);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Invest</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const totalSupply = result?.fund?.routes?.shares?.totalSupply;

  const fallback = (
    <>
      Investing into funds that have been created before the Melon price feed update on December 2, 2019 is not
      possible, see{' '}
      <a href="https://medium.com/melonprotocol/melon-pricefeed-upgrade-81c5c8febae2">
        https://medium.com/melonprotocol/melon-pricefeed-upgrade-81c5c8febae2
      </a>
    </>
  );

  return (
    <Block>
      <SectionTitle>Invest</SectionTitle>
      <RequiresFundCreatedAfter after={new Date('2019-12-19')} fallback={fallback}>
        {action === 'cancel' && (
          <CancelRequest address={address} account={account!} loading={query.networkStatus < 7} />
        )}
        {action === 'invest' && (
          <RequestInvestment
            address={address}
            allowedAssets={allowedAssets}
            totalSupply={totalSupply}
            account={account!}
            loading={query.networkStatus < 7}
          />
        )}
        {action === 'execute' && (
          <ExecuteRequest address={address} account={account!} loading={query.networkStatus < 7} />
        )}
        {action === 'waiting' && (
          <p>
            You need to wait before you can execute your investment request. The time-window to execute your investment
            request is between the next price update and 24 hours after your investment request .
          </p>
        )}
      </RequiresFundCreatedAfter>
    </Block>
  );
};
