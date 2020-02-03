import React from 'react';
import { useFundMetricsQuery } from '~/queries/FundMetrics';
import { useCoinAPI } from '~/hooks/useCoinAPI';
import {
  Dictionary,
  DictionaryEntry,
  DictionaryLabel,
  DictionaryData,
} from '~/storybook/components/Dictionary/Dictionary';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { Grid, GridCol, GridRow } from '~/storybook/components/Grid/Grid';

export const FundMetrics: React.FC = () => {
  const [metrics, metricsQuery] = useFundMetricsQuery();
  const coinApi = useCoinAPI();

  if (metricsQuery.loading || !metrics) {
    return (
      <Dictionary>
        <SectionTitle>Network metrics</SectionTitle>
        <Spinner />
      </Dictionary>
    );
  }

  const history = metrics.melonNetworkHistories && metrics.melonNetworkHistories[0];
  const investors = metrics.investorCounts && metrics.investorCounts[0];
  const funds = metrics.fundCounts && metrics.fundCounts[0];

  const weiToEth = fromTokenBaseUnit(history?.gav, 18);
  const mlnPrice = weiToEth.multipliedBy(coinApi.data.rate);

  return (
    <Dictionary>
      <SectionTitle>Network metrics</SectionTitle>
      <Grid>
        <GridRow>
          <GridCol xs={12} sm={6}>
            {funds && (
              <DictionaryEntry>
                <DictionaryLabel>Number of funds</DictionaryLabel>
                <DictionaryData>
                  {parseInt(funds.active ?? '0', 10) + parseInt(funds.nonActive ?? '0', 10)}
                </DictionaryData>
              </DictionaryEntry>
            )}
            {investors && (
              <DictionaryEntry>
                <DictionaryLabel>Number of investors</DictionaryLabel>
                <DictionaryData>{parseInt(investors.numberOfInvestors ?? '0', 10)}</DictionaryData>
              </DictionaryEntry>
            )}
          </GridCol>
          <GridCol xs={12} sm={6}>
            <DictionaryEntry>
              <DictionaryLabel>Total AUM (in ETH)</DictionaryLabel>
              <DictionaryData>
                <FormattedNumber suffix="ETH" value={weiToEth} />
              </DictionaryData>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryLabel>Total AUM (in USD)</DictionaryLabel>
              <DictionaryData>
                <FormattedNumber suffix="USD" value={mlnPrice} />
              </DictionaryData>
            </DictionaryEntry>
          </GridCol>
        </GridRow>
      </Grid>
    </Dictionary>
  );
};
