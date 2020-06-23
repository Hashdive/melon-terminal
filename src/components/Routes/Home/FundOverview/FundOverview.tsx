import React from 'react';
import { Column, useTable, useSortBy, usePagination, useGlobalFilter, TableOptions, useRowState } from 'react-table';
import { useFundOverviewQuery } from './FundOverview.query';
import { CommonTable } from '~/components/Common/Table/Table';
import { TokenValue } from '~/TokenValue';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import BigNumber from 'bignumber.js';
import { useRatesOrThrow } from '~/components/Contexts/Rates/Rates';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { Spinner } from '~/storybook/Spinner/Spinner';

type RowData = {
  address: string;
  name: string;
  inception: Date;
  returnSinceInception: BigNumber;
  returnSinceYesterday: BigNumber;
  holdings: TokenValue[];
  eth: BigNumber;
  usd: BigNumber;
};

const columns: Column<RowData>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    filter: 'text',
  },

  {
    Header: 'AUM [ETH]',
    accessor: 'eth',
    sortType: (rowA, rowB, columnId) => {
      const a = new BigNumber(rowA.values[columnId]);
      const b = new BigNumber(rowB.values[columnId]);
      return b.comparedTo(a);
    },
    Cell: (cell) => <TokenValueDisplay value={cell.value} decimals={18} />,
  },
  {
    Header: 'AUM [USD]',
    accessor: 'usd',
    sortType: (rowA, rowB, columnId) => {
      const a = new BigNumber(rowA.values[columnId]);
      const b = new BigNumber(rowB.values[columnId]);
      return b.comparedTo(a);
    },
    Cell: (cell) => <TokenValueDisplay value={cell.value} decimals={18} digits={0} />,
  },
  {
    Header: 'Since inception',
    accessor: 'returnSinceInception',
    sortType: (rowA, rowB, columnId) => {
      const a = new BigNumber(rowA.values[columnId]);
      const b = new BigNumber(rowB.values[columnId]);
      return b.comparedTo(a);
    },
    Cell: (cell) => <FormattedNumber value={cell.value} colorize={true} decimals={2} suffix="%" />,
  },
  {
    Header: 'Since yesterday',
    accessor: 'returnSinceYesterday',
    sortType: (rowA, rowB, columnId) => {
      const a = new BigNumber(rowA.values[columnId]);
      const b = new BigNumber(rowB.values[columnId]);
      return b.comparedTo(a);
    },
    Cell: (cell) => <FormattedNumber value={cell.value} colorize={true} decimals={2} suffix="%" />,
  },
  {
    Header: 'Top 2 assets',
    accessor: 'holdings',
    disableSortBy: true,
    Cell: (cell) =>
      !new BigNumber(cell.row.original.eth).isZero() ? (
        <ul>
          {cell.value.map((item) =>
            !new BigNumber(item.value || 0).isZero() ? (
              <li key={item.token.symbol}>
                {item.value?.dividedBy(cell.row.original.eth).multipliedBy(100).toFixed(2)}% {item.token.symbol}
              </li>
            ) : (
              <li>-</li>
            )
          )}
          {cell.value.length === 1 && <li>-</li>}
        </ul>
      ) : (
        <ul>
          <li>-</li>
          <li>-</li>
        </ul>
      ),
  },
];

function useTableDate() {
  const result = useFundOverviewQuery();
  const rates = useRatesOrThrow();
  const environment = useEnvironment()!;

  const data = React.useMemo(() => {
    const funds = result.data?.funds ?? [];
    return funds.map<RowData>((item) => {
      const holdings = item.holdings.map((item) => {
        const token = environment.getToken(item.asset.symbol);
        const quantity = item.assetGav;
        return new TokenValue(token, quantity);
      });

      const eth = item.gav;
      const usd = new BigNumber(item.gav).multipliedBy(rates.ETH.USD);

      const returnSinceInception = calculateChangeFromSharePrice(item.sharePrice, new BigNumber('1e18'));

      const returnSinceYesterday = calculateChangeFromSharePrice(
        item.calculationsHistory[0]?.sharePrice,
        item.calculationsHistory[1]?.sharePrice
      );

      return {
        address: item.id,
        name: item.name,
        inception: new Date(item.createdAt * 1000),
        returnSinceInception,
        returnSinceYesterday,
        holdings,
        eth,
        usd,
      };
    });
  }, [result.data]);

  return data;
}

export const FundOverview: React.FC = () => {
  const data = useTableDate();
  const options: TableOptions<RowData> = React.useMemo(
    () => ({
      columns,
      data,
      pageCount: Math.ceil(data.length % 10),
      defaultCanSort: true,
    }),
    [data]
  );

  const table = useTable(options, useGlobalFilter, useSortBy, usePagination, useRowState);

  if (data.length === 0) {
    return (
      <Block>
        <SectionTitle> Melon Fund Universe</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  return (
    <Block>
      <SectionTitle> Melon Fund Universe</SectionTitle>
      <CommonTable table={table} />
    </Block>
  );
};
