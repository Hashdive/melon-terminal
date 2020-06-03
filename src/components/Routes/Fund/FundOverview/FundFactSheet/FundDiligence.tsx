import React, { Fragment } from 'react';
import { sameAddress } from '@melonproject/melonjs';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useFundDetailsQuery } from '../FundDetails.query';
import { SectionTitle } from '~/storybook/Title/Title';
import {
  Dictionary,
  DictionaryEntry,
  DictionaryData,
  DictionaryLabel,
  DictionaryDivider,
} from '~/storybook/Dictionary/Dictionary';
import { EtherscanLink } from '~/components/Common/EtherscanLink/EtherscanLink';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundCalculationHistoryQuery } from '~/components/Routes/Fund/FundOverview/FundFactSheet/FundCalculationHistory.query';
import BigNumber from 'bignumber.js';
import { standardDeviation } from '~/utils/finance';
import { TwitterLink } from '~/components/Common/TwitterLink/TwitterLink';
import { useAccount } from '~/hooks/useAccount';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { range } from 'ramda';
import { useFundSlug } from '../../FundHeader/FundSlug.query';
import { NetworkEnum } from '~/types';

export interface NormalizedCalculation {
  sharePrice: BigNumber;
  dailyReturn: number;
  logReturn: number;
  timestamp: number;
}

export interface FundFactSheetProps {
  address: string;
}

export const numberPadding = (digits: number, maxDigits: number) => {
  return range(0, maxDigits - digits)
    .map(() => String.fromCharCode(160))
    .join('');
};

export const FundDiligence: React.FC<FundFactSheetProps> = ({ address }) => {
  const [fund, fundQuery] = useFundDetailsQuery(address);
  const environment = useEnvironment()!;
  const account = useAccount();
  const [calculations, calculationsQuery] = useFundCalculationHistoryQuery(address);
  const [slug] = useFundSlug(address);

  if (!fundQuery || fundQuery.loading || !calculationsQuery || calculationsQuery.loading) {
    return (
      <Dictionary>
        <SectionTitle>Fund Factsheet</SectionTitle>
        <Spinner />
      </Dictionary>
    );
  }

  if (!fund) {
    return null;
  }

  const routes = fund.routes;
  const creation = fund.creationTime;
  const accounting = routes?.accounting;
  const shares = routes?.shares;
  const version = routes?.version;
  const feeManager = routes?.feeManager;
  const managementFee = feeManager?.managementFee;
  const performanceFee = feeManager?.performanceFee;

  const initializeSeconds = (fund?.routes?.feeManager?.performanceFee?.initializeTime.getTime() || Date.now()) / 1000;
  const secondsNow = Date.now() / 1000;
  const secondsSinceInit = secondsNow - initializeSeconds;
  const performanceFeePeriodInSeconds = (performanceFee?.period || 1) * 24 * 60 * 60;
  const secondsSinceLastPeriod = secondsSinceInit % performanceFeePeriodInSeconds;
  const nextPeriodStart = secondsNow + (performanceFeePeriodInSeconds - secondsSinceLastPeriod);

  const normalizedCalculations = calculations.map((item, index, array) => {
    const returnSinceLastPriceUpdate =
      index > 0
        ? new BigNumber(item.sharePrice).dividedBy(new BigNumber(array[index - 1].sharePrice)).toNumber() - 1
        : 0;

    let dailyReturn = returnSinceLastPriceUpdate;
    if (dailyReturn > 100 || dailyReturn <= -1) {
      dailyReturn = 0;
    }

    return {
      sharePrice: item.sharePrice,
      dailyReturn: index > 0 ? dailyReturn * 100 : 0,
      logReturn: index > 0 ? Math.log(1 + dailyReturn) : 0,
      timestamp: new BigNumber(item.timestamp).toNumber(),
    };
  });

  const gavDigits = accounting?.grossAssetValue.integerValue().toString().length;
  const navDigits = accounting?.netAssetValue.integerValue().toString().length;
  const sharesDigits = shares?.totalSupply.integerValue().toString().length;
  const sharePriceDigits = accounting?.sharePrice.integerValue().toString().length;
  const maxDigits = Math.max(gavDigits || 0, navDigits || 0, sharesDigits || 0, sharePriceDigits || 0);

  const numbersLength = normalizedCalculations.length;
  const firstChange = (normalizedCalculations?.[0] || []) as NormalizedCalculation;
  const afterChange = (normalizedCalculations?.[numbersLength - 1] || []) as NormalizedCalculation;

  const returnSinceInception =
    firstChange && afterChange
      ? (new BigNumber(afterChange.sharePrice).dividedBy(new BigNumber(firstChange.sharePrice)).toNumber() - 1) * 100
      : null;

  const oneYear = 60 * 60 * 24 * 365.25;
  const annualizedReturn =
    returnSinceInception &&
    (Math.pow(1 + returnSinceInception / 100, oneYear / (afterChange.timestamp - firstChange.timestamp)) - 1) * 100;

  const creationTime = creation.getTime() || Date.now();
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const olderThanOneYear = creationTime < oneYearAgo;

  const volatility =
    normalizedCalculations &&
    standardDeviation(normalizedCalculations.map((item) => item.logReturn)) * 100 * Math.sqrt(365.25);

  return (
    <Dictionary>
      <SectionTitle>
        <span>Fund Factsheet</span>
      </SectionTitle>
      <DictionaryEntry>
        <DictionaryLabel>Fund name</DictionaryLabel>
        <DictionaryData>{fund.name}</DictionaryData>
      </DictionaryEntry>

      <DictionaryEntry>
        <DictionaryLabel>Gross asset value (GAV)</DictionaryLabel>
        <DictionaryData>
          <span>{numberPadding(gavDigits || 0, maxDigits)}</span>
          <TokenValueDisplay value={accounting?.grossAssetValue} symbol="WETH" decimals={0} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Net asset value (NAV)</DictionaryLabel>
        <DictionaryData>
          <span>{numberPadding(navDigits || 0, maxDigits)}</span>
          <TokenValueDisplay value={accounting?.netAssetValue} symbol="WETH" decimals={0} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Total number of shares</DictionaryLabel>
        <DictionaryData>
          <span>{numberPadding(sharesDigits || 0, maxDigits)}</span>
          <TokenValueDisplay value={shares?.totalSupply} decimals={0} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Share price</DictionaryLabel>
        <DictionaryData>
          <span>{numberPadding(sharePriceDigits || 0, maxDigits)}</span>
          <TokenValueDisplay value={accounting?.sharePrice} symbol="WETH" decimals={0} />
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Inception</DictionaryLabel>
        <DictionaryData>{creation ? <FormattedDate timestamp={creation} /> : 'N/A'}</DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Status</DictionaryLabel>
        <DictionaryData>{fund.isShutDown ? 'Inactive' : 'Active'}</DictionaryData>
      </DictionaryEntry>

      <DictionaryDivider />
      <SectionTitle>Fund Performance</SectionTitle>

      <DictionaryDivider />
      <SectionTitle>Due Diligence</SectionTitle>
      <DictionaryEntry>
        <DictionaryLabel>Annualized return</DictionaryLabel>
        <DictionaryData>
          {olderThanOneYear ? (
            <FormattedNumber value={annualizedReturn} colorize={true} decimals={2} suffix="%" />
          ) : (
            <>Too early to tell</>
          )}
        </DictionaryData>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryLabel>Annual volatility</DictionaryLabel>
        <DictionaryData>
          {olderThanOneYear ? (
            <FormattedNumber value={volatility} colorize={false} decimals={2} suffix="%" />
          ) : (
            <>Too early to tell</>
          )}
        </DictionaryData>
      </DictionaryEntry>
    </Dictionary>
  );
};
