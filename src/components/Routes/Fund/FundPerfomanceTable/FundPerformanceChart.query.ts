import gql from 'graphql-tag';
import BigNumber from 'bignumber.js';
import { Serie, Datum } from '@nivo/line';
import { useLazyTheGraphQuery, OnChainQueryLazyHookOptions } from '~/hooks/useQuery';
import { format, fromUnixTime } from 'date-fns';
import { LineChartData } from '~/components/Charts/Nivo/Nivo';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';

/**
 * Query must take a fund address and a date
 * Query method must return
 * {
 *  earliestDate: number
 *  data: Serie[]
 * }
 *
 * where Serie is an imported Nivo type that looks like:
 * {
 *  y: price (number with four decimals)
 *  x: date (format 'yyyy-MM-dd')
 * }
 *
 *
 * add tests to parsing function
 *
 *
 */

export interface FundSharePriceQueryVariables {
  start: number;
  funds: string[];
}

const FundSharePriceQuery = gql`
  query FundSharePriceQuery($funds: [String!]!, $start: BigInt!) {
    funds(where: { id_in: $funds }) {
      name
      createdAt
      calculationsHistory(
        where: { source: "priceUpdate", timestamp_gt: $start }
        first: 1000
        orderBy: timestamp
        orderDirection: desc
      ) {
        sharePrice
        source
        validPrices
        timestamp
      }
    }
  }
`;

export interface CalculationHistory {
  timestamp: number;
  sharePrice: number;
  source: string;
  validPrices: boolean;
}

export interface FundSharePriceQueryResult {
  createdAt: number;
  name: string;
  calculationsHistory: CalculationHistory[];
}

export interface FundSharePricesParsed {
  earliestDate: number | undefined;
  data: Serie[];
}

export const useFundSharePriceQuery = () => {
  return useLazyTheGraphQuery<any, FundSharePriceQueryVariables>(FundSharePriceQuery);
};

export function parseSharePriceQueryData(input: FundSharePriceQueryResult[], startDate: BigNumber): LineChartData {
  // takes an array of - fund objects (must pass correct result.data.funds to function)
  // returns an an object with two values - the oldest date to display and an
  // array of Series: { id: string | number, data: Datum[] }
  // where data is an array of {x: , y: }
  // where x is a date (yyy-MM-dd) and y is a number representing share price
  // also needs to sort by before startDate and after
  // de-duplicate - only take the first update on a given date
  // remove calculations with null and 0 prices
  // remove validPrices false price
  const editedDate = startDate.dividedBy(1000).toNumber();
  const returnObject: LineChartData = {
    earliestDate: 0,
    data: [],
  };

  for (let i of input) {
    // find earliest date
    if (!returnObject.earliestDate || returnObject.earliestDate < i.createdAt) {
      returnObject['earliestDate'] = parseInt(i.createdAt);
    }

    // declare empty array to track dates
    const seenDates: { [date: string]: boolean } = {};

    // declare fund object to push onto returnObject.data
    const fundInfo: Serie = { id: i.name, data: [] };

    // loop through calculations
    for (let j of i.calculationsHistory) {
      const date = format(fromUnixTime(j.timestamp), 'yyyy-MM-dd');

      // skip it if sharePrice is null or zero or if validPrices is false
      if (!j.sharePrice || !j.validPrices) {
        continue;
      }

      // skip it if the item's date is before the chart's start date
      if (j.timestamp < editedDate) {
        continue;
      }

      // check if you've seen the date before, if not, add it to the dictionary
      // and push the price into the price array
      if (!seenDates[`${date}`]) {
        seenDates[`${date}`] = true;
        fundInfo.data.push({ y: toTokenBaseUnit(j.sharePrice, 18).toFixed(4), x: date });
      }
    }
    // push the Datum into the Serie
    returnObject.data.push(fundInfo);
  }

  return returnObject;
}

/**
{ 
  funds: [
    {calculationsHistory: [
     {
        sharePrices: string or number not sure
        source: "priceUpdate"
        timestamp: string or number
        validPrices: boolean
     }
    ],
    createdAt: string or number not sure
    name: string}
  ] 
}
 */
