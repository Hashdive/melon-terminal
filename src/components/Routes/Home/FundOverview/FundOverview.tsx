import BigNumber from 'bignumber.js';
import React from 'react';
import { useHistory } from 'react-router';
import { Column, TableOptions, useGlobalFilter, usePagination, useRowState, useSortBy, useTable } from 'react-table';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { CommonTable } from '~/components/Common/Table/Table';
import { TokenValueDisplay } from '~/components/Common/TokenValueDisplay/TokenValueDisplay';
import { useRatesOrThrow } from '~/components/Contexts/Rates/Rates';
import { Button } from '~/components/Form/Button/Button';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Block } from '~/storybook/Block/Block';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { SectionTitle } from '~/storybook/Title/Title';
import { TokenValue } from '~/TokenValue';
import { calculateChangeFromSharePrice } from '~/utils/calculateChangeFromSharePrice';
import { useFundOverviewQuery } from './FundOverview.query';
import { getNetworkName } from '~/config';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useVersionQuery } from '~/components/Layout/Version.query';
import {
  GiCaesar,
  GiCoins,
  GiBrokenPottery,
  GiLaurels,
  GiClosedDoors,
  GiPegasus,
  GiPiggyBank,
  GiShamblingZombie,
} from 'react-icons/gi';
import { Tooltip } from '~/storybook/Tooltip/Tooltip';
import { fromTokenBaseUnit } from '~/utils/fromTokenBaseUnit';

type RowData = {
  rank: number;
  address: string;
  name: string;
  inception: Date;
  returnSinceInception: BigNumber;
  returnSinceYesterday: BigNumber;
  holdings: TokenValue[];
  eth: BigNumber;
  usd: BigNumber;
  isShutdown: boolean;
  version: string;
};

const columns = (version: string, prefix: string, history: any): Column<RowData>[] => {
  return [
    {
      Header: 'Name',
      accessor: 'name',
      filter: 'text',
      headerProps: {
        style: {
          textAlign: 'left',
        },
      },
      Cell: (cell) => (
        <span>
          {cell.value}
          <br />
          {cell.row.original.rank === 1 && (
            <Tooltip value="Largest fund on Melon">
              <GiCaesar color="#C9B037" />
            </Tooltip>
          )}
          {cell.row.original.rank === 2 && (
            <Tooltip value="2nd largest fund on Melon">
              <GiLaurels color="#B4B4B4" />
            </Tooltip>
          )}
          {cell.row.original.rank === 3 && (
            <Tooltip value="3rd largest fund on Melon">
              <GiLaurels color="#AD8A56" />
            </Tooltip>
          )}
          {new BigNumber(cell.row.original.eth).isGreaterThanOrEqualTo('5e19') && (
            <>
              {' '}
              <Tooltip value="Fund managing more than 50 ETH">
                <GiCoins color="#C9B037" />
              </Tooltip>
            </>
          )}
          {new BigNumber(cell.row.original.eth).isLessThan('1e17') && !new BigNumber(cell.row.original.eth).isZero() && (
            <>
              {' '}
              <Tooltip value="Tiny fund">
                <GiPiggyBank color="FF6EC7" />
              </Tooltip>
            </>
          )}
          {new BigNumber(cell.row.original.eth).isZero() && (
            <>
              {' '}
              <Tooltip value="Empty fund">
                <GiShamblingZombie color="grey" />
              </Tooltip>
            </>
          )}
          {new BigNumber(cell.row.original.returnSinceInception).isLessThan(-20) && (
            <>
              {' '}
              <Tooltip value="Bad-performing fund">
                <GiBrokenPottery color="red" />
              </Tooltip>
            </>
          )}
          {new BigNumber(cell.row.original.returnSinceInception).isGreaterThan(50) && (
            <>
              {' '}
              <Tooltip value="Well-performing fund">
                <GiPegasus color="green" />
              </Tooltip>
            </>
          )}
          {cell.row.original.isShutdown ||
            (cell.row.original.version !== version && (
              <Tooltip value="Closed for investment">
                <GiClosedDoors color="grey" />
              </Tooltip>
            ))}{' '}
        </span>
      ),
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
      cellProps: {
        style: {
          textAlign: 'right',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: 'AUM [USD]',
      accessor: 'usd',
      sortType: (rowA, rowB, columnId) => {
        const a = new BigNumber(rowA.values[columnId]);
        const b = new BigNumber(rowB.values[columnId]);
        return b.comparedTo(a);
      },
      Cell: (cell) => <FormattedNumber value={fromTokenBaseUnit(cell.value, 18)} decimals={0} />,
      cellProps: {
        style: {
          textAlign: 'right',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
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
      cellProps: {
        style: {
          textAlign: 'right',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: '1 day',
      accessor: 'returnSinceYesterday',
      sortType: (rowA, rowB, columnId) => {
        const a = new BigNumber(rowA.values[columnId]);
        const b = new BigNumber(rowB.values[columnId]);
        return b.comparedTo(a);
      },
      Cell: (cell) => <FormattedNumber value={cell.value} colorize={true} decimals={2} suffix="%" />,
      cellProps: {
        style: {
          textAlign: 'right',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: 'Top assets',
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
      cellProps: {
        style: {
          textAlign: 'right',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
    {
      Header: 'Invest',
      accessor: 'address',
      disableSortBy: true,
      Cell: (cell) => (
        <Button
          kind="secondary"
          size="small"
          onClick={() => history.push(`/${prefix}/fund/${cell.row.original.address}/invest`)}
        >
          Invest
        </Button>
      ),
      cellProps: {
        style: {
          textAlign: 'right',
          verticalAlign: 'middle',
        },
      },
      headerProps: {
        style: {
          textAlign: 'right',
        },
      },
    },
  ];
};

function useTableDate() {
  const result = useFundOverviewQuery();
  const rates = useRatesOrThrow();
  const environment = useEnvironment()!;

  const data = React.useMemo(() => {
    const funds = result.data?.funds ?? [];
    return funds.map<RowData>((item, index) => {
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
        rank: index + 1,
        address: item.id,
        name: item.name,
        inception: new Date(item.createdAt * 1000),
        returnSinceInception,
        returnSinceYesterday,
        holdings,
        eth,
        usd,
        isShutdown: item.isShutdown,
        version: item.version.name,
      };
    });
  }, [result.data]);

  return data;
}

export const FundOverview: React.FC = () => {
  const data = useTableDate();
  const history = useHistory();
  const connection = useConnectionState();
  const [version] = useVersionQuery();

  const prefix = getNetworkName(connection.network);

  const leaderboardOptions: TableOptions<RowData> = React.useMemo(
    () => ({
      columns: columns(version?.name, prefix || '', history),
      data,
      pageCount: Math.ceil(data.length % 10),
      defaultCanSort: true,
      rowProps: (row) => ({ onClick: () => history.push(`/${prefix}/fund/${row.original.address}`) }),
    }),
    [data, history]
  );

  const options: TableOptions<RowData> = React.useMemo(
    () => ({
      columns: columns(version?.name, prefix || '', history),
      data,
      pageCount: Math.ceil(data.length % 10),
      defaultCanSort: true,
      rowProps: (row) => ({ onClick: () => history.push(`/${prefix}/fund/${row.original.address}`) }),
    }),
    [data, history]
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
    <>
      <Block>
        <SectionTitle>Melon Fund Leaderboard</SectionTitle>
        <p>Best 1D performance</p>
        <p>Best MTD performance</p>
        <p>Best YTD performance</p>
        <p>Largest fund</p>
      </Block>
      <Block>
        <SectionTitle> Melon Fund Universe</SectionTitle>
        <CommonTable table={table} />
      </Block>
    </>
  );
};
