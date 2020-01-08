import React from 'react';
import { useFundDetailsQuery } from '~/queries/FundDetails';
import { DataBlock } from '~/storybook/components/DataBlock/DataBlock';
import { Bar, BarContent } from '~/storybook/components/Bar/Bar';
import { Headline } from '~/storybook/components/Headline/Headline';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';

export interface FundHeaderProps {
  address: string;
}

export const FundHeader: React.FC<FundHeaderProps> = ({ address }) => {
  const [fund] = useFundDetailsQuery(address);
  const link = useEtherscanLink({ address });

  if (!fund) {
    return null;
  }

  const routes = fund.routes;
  const accounting = routes && routes.accounting;

  return (
    <>
      <Bar>
        <BarContent justify="between">
          <Headline
            title={fund.name}
            text={
              <a target="_blank" href={link!}>
                {address}
              </a>
            }
            icon="icon"
          />
          <DataBlock label="Share price">{accounting?.sharePrice?.toFixed(4) || 0} WETH / share</DataBlock>
          <DataBlock label="AUM">{accounting?.grossAssetValue?.toFixed(4) || 0}</DataBlock>
        </BarContent>
      </Bar>
    </>
  );
};
