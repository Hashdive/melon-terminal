import React from 'react';
import { TokenValue } from '~/TokenValue';
import BigNumber from 'bignumber.js';
import ReactApexChart from 'react-apexcharts';

export interface FundAllocationChartProps {
  gav: BigNumber;
  holdings: TokenValue[];
}

export const FundAllocationChart: React.FC<FundAllocationChartProps> = (props) => {
  const series = props.holdings.map((item) => item.value?.dividedBy(props.gav).multipliedBy(100).toNumber());
  const labels = props.holdings.map((item) => item.token.symbol);

  const options = {
    series,
    labels,
    chart: {
      width: 40,
      height: 40,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
    },
  };

  if (!props.holdings?.length) {
    return <>empty</>;
  }

  return (
    <>
      <ReactApexChart options={options} series={series} type="donut" width={40} />
      {/* <ul>
        {props.holdings.map((item) => (
          <li key={item.token.symbol}>
            {item.value?.dividedBy(props.gav).multipliedBy(100).toFixed(2)}% {item.token.symbol}
          </li>
        ))}
      </ul> */}
    </>
  );
};
