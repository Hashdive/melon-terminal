import React from 'react';
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
  height: 100%;
  float: right;
`;

export const FundAllocationChart: React.FC<FundAllocationChartProps> = (props) => {
  const theme = useTheme();

  const series = [
    {
      data: props.holdings.map((item) => item.value?.dividedBy(props.gav).multipliedBy(100).toNumber()),
    },
  ];
  const labels = props.holdings.map((item) => item.token.symbol);

  const options = {
    series,
    chart: {
      type: 'bar',
      width: 100,
      height: 35,
      sparkline: {
        enabled: true,
      },
    },
    // plotOptions: {
    //   bar: {
    //     columnWidth: '80%',
    //   },
    // },
    labels,
    xaxis: {
      crosshairs: {
        width: 1,
      },
      categories: labels,
    },
    colors: [theme.mainColors.primaryDark, '#aaaaaa'],
    tooltip: {
      theme: theme.mode,
      //   fixed: {
      //     enabled: false,
      //   },
      //   x: {
      //     show: false,
      //   },
      //   y: {
      //     show: true,
      //     formatter: function ({ series, seriesIndex, dataPointIndex, w }) {
      //       return w?.globals.labels?.[dataPointIndex] + ': ' + series?.[seriesIndex]?.[dataPointIndex];
      //     },
      //   },
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
      <ReactApexChart options={options} series={series} type="bar" width={70} />
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
