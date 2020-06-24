import React from 'react';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useTokenRates } from '~/components/Contexts/Rates/Rates';
import { useFundMetricsQuery } from '~/components/Routes/Home/FundMetrics/FundMetrics.query';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Block } from '~/storybook/Block/Block';

import styled from 'styled-components';

export const MetricsUsd = styled.div`
  width: 100%;
  text-align: 'center';
  font-weight: ${(props) => props.theme.fontWeights.bold};
  font-size: ${(props) => props.theme.fontSizes.xxxl};
`;

export const MetricsOthers = styled.div`
  width: 100%;
  text-align: 'center';
  font-weight: ${(props) => props.theme.fontWeights.regular};
  font-size: ${(props) => props.theme.fontSizes.xxl};
  margin-top: 20px;
`;

export const FundMetrics: React.FC = () => {
  const [metrics, metricsQuery] = useFundMetricsQuery();
  const rates = useTokenRates('ETH');

  if (metricsQuery.loading || !metrics) {
    return (
      <>
        <Block>
          <SectionTitle>Assets Managed with Melon Protocol</SectionTitle>
          <Spinner />
        </Block>
      </>
    );
  }

  const networkGav = fromTokenBaseUnit(metrics.state?.networkGav, 18);

  const activeFunds = metrics.state?.activeFunds;
  const nonActiveFunds = metrics.state?.nonActiveFunds;
  const allInvestments = metrics.state?.allInvestments;

  const mlnPrice = networkGav.multipliedBy(rates.USD);

  return (
    <>
      <Block>
        <SectionTitle>Assets Managed with Melon Protocol</SectionTitle>
        <MetricsUsd>
          <FormattedNumber value={mlnPrice} decimals={0} prefix="$" />
        </MetricsUsd>
        <MetricsOthers>{parseInt(activeFunds ?? '0', 10) + parseInt(nonActiveFunds ?? '0', 10)} funds</MetricsOthers>
        <MetricsOthers>{parseInt(allInvestments ?? '0', 10)} investments</MetricsOthers>
      </Block>
    </>
  );
};
