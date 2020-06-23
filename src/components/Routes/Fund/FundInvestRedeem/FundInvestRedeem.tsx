import React from 'react';
import { FundInvest } from './FundInvest/FundInvest';
import { FundRedeem } from './FundRedeem/FundRedeem';
import { FundInvestmentHistoryList } from './FundInvestmentHistoryList/FundInvestmentHistoryList';
import { Grid, GridRow, GridCol } from '~/storybook/Grid/Grid';
import { RequiresAccount } from '~/components/Gates/RequiresAccount/RequiresAccount';

export interface FundInvestProps {
  address: string;
}

export const FundInvestRedeem: React.FC<FundInvestProps> = ({ address }) => {
  return (
    <Grid>
      <RequiresAccount
        fallback={true}
        outputText="You must be logged in with a connection provider to invest in a fund."
      >
        <GridRow>
          <GridCol xs={12} sm={6}>
            <FundInvest address={address} />
          </GridCol>
          <GridCol xs={12} sm={6}>
            <FundRedeem address={address} />
          </GridCol>
        </GridRow>
      </RequiresAccount>
      <GridRow>
        <GridCol xs={12} sm={12}>
          <FundInvestmentHistoryList address={address} />
        </GridCol>
      </GridRow>
    </Grid>
  );
};

export default FundInvestRedeem;
