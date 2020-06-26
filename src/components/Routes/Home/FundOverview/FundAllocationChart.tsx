import React, { useMemo } from 'react';
import * as R from 'ramda';
import { TokenValue } from '~/TokenValue';
import BigNumber from 'bignumber.js';
import ReactApexChart from 'react-apexcharts';
import styled, { useTheme } from 'styled-components';

export interface FundAllocationChartProps {
  gav: BigNumber;
  holdings: TokenValue[];
}

export const Chart = styled.div`
  display: flex;
  flex-direction: column;
  vertical-align: bottom;
  height: 40px;
  float: right;
`;

export const FundAllocationChart: React.FC<FundAllocationChartProps> = (props) => {
  const theme = useTheme();

  const percentages = useMemo(
    () => props.holdings.map((item) => new BigNumber(item.value!).dividedBy(props.gav).multipliedBy(100).toNumber()),
    [props.holdings, props.gav]
  );

  const series = [{ data: percentages }];

  const colors = [
    '#B4B4B4',
    '#AD8A56',
    '#AF9500',
    '#D7D7D7',
    '#C9B037',
    '#6A3805',
    '#B4B4B4',
    '#AD8A56',
    '#AF9500',
    '#D7D7D7',
    '#C9B037',
    '#6A3805',
    '#B4B4B4',
    '#AD8A56',
    '#AF9500',
    '#D7D7D7',
    '#C9B037',
    '#6A3805',
  ];

  const labels = props.holdings.map((item) => item.token.symbol);

  const options = {
    series,
    colors: [
      function (args: any) {
        return colors[args.dataPointIndex ?? 0];
      },
    ],
    chart: {
      animations: {
        enabled: false,
      },
      type: 'bar',
      sparkline: {
        enabled: true,
      },
    },

    labels,

    grid: {
      padding: {
        top: 5,
      },
    },

    xaxis: {
      type: 'category',
      crosshairs: {
        width: 1,
      },
      axisTicks: { show: false },
      labels: {
        show: false,
      },
    },
    yaxis: {
      // min: 0,
      // max: 100,
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.mode,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        return (
          w?.globals.labels?.[dataPointIndex] +
          ': ' +
          parseFloat(series?.[seriesIndex]?.[dataPointIndex]).toFixed(4) +
          '%'
        );
      },
      marker: {
        show: false,
      },
    },
  };

  return (
    <Chart>
      <ReactApexChart options={options} series={series} type="bar" width={120} height={40} />
    </Chart>
  );
};
