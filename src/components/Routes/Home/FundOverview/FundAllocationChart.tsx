import React from 'react';
import * as R from 'ramda';
import { TokenValue } from '~/TokenValue';
import BigNumber from 'bignumber.js';
import ReactApexChart from 'react-apexcharts';
import styled, { useTheme } from 'styled-components';
import { Icons } from '~/storybook/Icons/Icons';

interface Serie {
  data: number[];
}

export interface FundAllocationChartProps {
  gav: BigNumber;
  holdings: TokenValue[];
}

export const Chart = styled.div`
  display: flex;
  flex-direction: column;
  vertical-align: bottom;
  height: 100%;
  float: right;
  padding-top: 5px;
`;

export const FundAllocationChart: React.FC<FundAllocationChartProps> = (props) => {
  const theme = useTheme();

  const percentages = props.holdings.map((item) =>
    new BigNumber(item.value!).dividedBy(props.gav).multipliedBy(100).toNumber()
  );

  const series = percentages.reduce((carry, item, index) => {
    const templateData = R.range(0, percentages.length).map((i) => 0);
    templateData[index] = item;
    return [...carry, { data: templateData }];
  }, [] as Serie[]);

  const labels = props.holdings.map((item) => item.token.symbol);

  const options = {
    series,
    colors: ['#D7D7D7', '#6A3805', '#C9B037', '#B4B4B4', '#AD8A56', '#AF9500'],
    chart: {
      type: 'bar',
      stacked: true,
      width: 150,
      height: '100%',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      show: false,
    },

    plotOptions: {
      barHeight: '90%',
    },

    xaxis: {
      type: 'category',
      crosshairs: {
        width: 1,
      },
      axisTicks: { show: false },
      categories: labels,
      labels: {
        show: false,
        rotate: -90,
        formatter: function (_: any, symbol: string) {
          return symbol;
        },
      },
    },
    yaxis: {
      // min: 0,
      // max: 100,
      labels: {
        show: false,
      },
    },
    // colors: [theme.mainColors.primaryDark, '#aaaaaa'],
    tooltip: {
      theme: theme.mode,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        return (
          w?.globals.labels?.[dataPointIndex] +
          ': ' +
          parseFloat(series?.[seriesIndex]?.[dataPointIndex]).toFixed(2) +
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
      <ReactApexChart options={options} series={series} type="bar" width={150} height={60} />
    </Chart>
  );

  //   const options = {
  //     series,
  //     labels,
  //     chart: {
  //       width: 40,
  //       height: 40,
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     stroke: {
  //       width: 0,
  //     },
  //     tooltip: {
  //       fixed: {
  //         enabled: false,
  //       },
  //     },
  //   };

  //   if (!props.holdings?.length) {
  //     return <>empty</>;
  //   }

  //   return <ReactApexChart options={options} series={series} type="donut" width={40} />;
};
