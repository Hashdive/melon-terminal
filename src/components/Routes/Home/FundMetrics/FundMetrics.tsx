import React from 'react';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { useTokenRates } from '~/components/Contexts/Rates/Rates';
import { useFundMetricsQuery } from '~/components/Routes/Home/FundMetrics/FundMetrics.query';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { Block } from '~/storybook/Block/Block';

import styled, { css } from 'styled-components';

export const MetricsBlock = styled.div`
  width: 100%;
  text-align: center;
`;

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
`;

export const FundMetrics: React.FC = () => {
  const [metrics, metricsQuery] = useFundMetricsQuery();
  const rates = useTokenRates('ETH');

  if (metricsQuery.loading || !metrics) {
    return <></>;
  }

  const networkGav = fromTokenBaseUnit(metrics.state?.networkGav, 18);

  const activeFunds = metrics.state?.activeFunds;
  const nonActiveFunds = metrics.state?.nonActiveFunds;
  const allInvestments = metrics.state?.allInvestments;

  const mlnPrice = networkGav.multipliedBy(rates.USD);

  return (
    <>
      <Grid>
        <GridRow justify="center">
          <GridCol xs={12} sm={12}>
            <MetricsBlock>
              Assets Managed with Melon Protocol
              <MetricsUsd>
                <FormattedNumber value={mlnPrice} decimals={0} prefix="$" />
              </MetricsUsd>
              <MetricsOthers>
                {parseInt(activeFunds ?? '0', 10) + parseInt(nonActiveFunds ?? '0', 10)} funds{' / '}
                {parseInt(allInvestments ?? '0', 10)} investments
              </MetricsOthers>
            </MetricsBlock>
          </GridCol>
        </GridRow>
      </Grid>
    </>
  );
};
