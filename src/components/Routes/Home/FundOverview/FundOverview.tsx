import React from 'react';
import { Column, useTable, useSortBy, usePagination, useGlobalFilter, TableOptions, Row, Cell } from 'react-table';
import { useFundOverviewQuery } from './FundOverview.query';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { CommonTable } from '~/components/Common/Table/Table';
import { TokenValue } from '~/TokenValue';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import BigNumber from 'bignumber.js';
import { useRatesOrThrow } from '~/components/Contexts/Rates/Rates';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

type RowData = {
  name: string;
  inception: Date;
  version: string;
  holdings: TokenValue[];
  eth: BigNumber;
  usd: BigNumber;
  btc: BigNumber;
  active: boolean;
};

const columns: Column<RowData>[] = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Inception',
    accessor: 'inception',
    sortType: 'datetime',
    Cell: (cell) => <FormattedDate timestamp={cell.value} format="yyyy/MM/dd" />,
  },
  {
    Header: 'Portfolio',
    accessor: 'holdings',
    disableSortBy: true,
    Cell: (cell) => (
      <ul>
        {cell.value.map((item) => (
          <li key={item.token.symbol}>
            <TokenValueDisplay value={item} />
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'aum',
    Header: 'AUM',
    sortType: (a, b) => b.original.eth.comparedTo(a.original.eth),
    Cell: (cell: Cell<RowData>) => <FormattedNumber value={cell.row.original.eth} suffix="ETH" decimals={0} />,
  },
  // {
  //   Header: 'AUM [ETH]',
  //   accessor: 'eth',
  //   sortType: (rowA, rowB, columnId) => {
  //     const a = rowA.values[columnId] as BigNumber;
  //     const b = rowB.values[columnId] as BigNumber;
  //     return b.comparedTo(a);
  //   },
  //   Cell: (cell) => <FormattedNumber value={cell.value} suffix="ETH" />,
  // },
  {
    Header: 'Protocol',
    accessor: 'version',
  },
  {
    Header: 'Status',
    accessor: 'active',
    sortType: 'basic',
    Cell: (cell) => (cell.value ? 'Active' : 'Inactive'),
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

      const eth = holdings.reduce<BigNumber>((carry, current) => {
        const rate = rates[current.token.symbol]?.ETH ?? 0;
        return carry.plus(current.value!.multipliedBy(rate));
      }, new BigNumber(0));

      const usd = holdings.reduce<BigNumber>((carry, current) => {
        const rate = rates[current.token.symbol]?.USD ?? 0;
        return carry.plus(current.value!.multipliedBy(rate));
      }, new BigNumber(0));

      const btc = holdings.reduce<BigNumber>((carry, current) => {
        const rate = rates[current.token.symbol]?.BTC ?? 0;
        return carry.plus(current.value!.multipliedBy(rate));
      }, new BigNumber(0));

      return {
        name: item.name,
        inception: new Date(item.createdAt * 1000),
        version: item.version.name,
        active: !item.isShutdown,
        holdings,
        eth,
        usd,
        btc,
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
      pageCount: Math.ceil(data.length % 20),
      defaultCanSort: true,
    }),
    [data]
  );

  const table = useTable(options, useGlobalFilter, useSortBy, usePagination);

  return <CommonTable table={table} />;
};
