import React from 'react';
import { useTheme } from 'styled-components';
import { Serie, ResponsiveLine } from '@nivo/line';
import { LinearScale, LogScale } from '@nivo/scales';
import { subMonths, startOfDay, isAfter, isBefore, subWeeks, getUnixTime } from 'date-fns';
import * as S from './Nivo.styles';
import { Block } from '~/storybook/Block/Block';
import { Spinner } from '~/storybook/Spinner/Spinner';

/**
 * The price chart must be passed a generator function that accepts the start date (currently defaulting to 1m)
 * and returns the earliest unix timestamp for a collection of data (in order to show the All Time sort button)
 * and an array of Serie objects containing the data to be displayed.
 *
 * Price data must be strictly positive in order to display logarithmic charts, and so as not to
 * screw up the display on linear charts.
 *
 * Linear charts may have gaps in the data, with the y value passed as null
 *
 * A logarithmic y axis is not yet possible - a bug within Nivo renders data backwards (highest
 * values at the bottom of the axis) occasionally and unpredictably. The corresponding code to
 * toggle log/linear has been commented out but left intact.
 *
 */
export interface LineChartData {
  earliestDate: number;
  data: Serie[];
}

export interface LineChartProps {
  triggerFunction: (start: number) => void;
  chartData?: LineChartData;
  startDate: number;
  loading: boolean;
}

interface ButtonDate {
  label: string;
  timeStamp: number;
  active: boolean;
  disabled: boolean;
}

// min should maybe be dynamic based on the lowest value that gets passed in through the generator
const linearProps = { type: 'linear', min: 'auto', max: 'auto', reverse: false } as LinearScale;
const logProps = { type: 'log', max: 'auto', min: 'auto' } as LogScale;

export const Nivo: React.FC<LineChartProps> = props => {
  const [yScaleType, setYScaleType] = React.useState<'linear' | 'log'>('linear');
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const yScale = React.useMemo(() => (yScaleType === 'linear' ? linearProps : logProps), [yScaleType]);
  const areaProp = false;
  const theme = useTheme();

  const historicalDates = React.useMemo<ButtonDate[]>(() => {
    const options = [
      { label: '1w', timeStamp: getUnixTime(subWeeks(today, 1)) },
      { label: '1m', timeStamp: getUnixTime(subMonths(today, 1)) },
      { label: '2m', timeStamp: getUnixTime(subMonths(today, 2)) },
      { label: '3m', timeStamp: getUnixTime(subMonths(today, 3)) },
      { label: '6m', timeStamp: getUnixTime(subMonths(today, 6)) },
      { label: '1y', timeStamp: getUnixTime(subMonths(today, 12)) },
    ];

    return options.map(item => ({
      ...item,
      disabled: !props.chartData || isAfter(props.chartData.earliestDate, item.timeStamp),
      active: item.timeStamp === props.startDate,
    }));
  }, [props.chartData, props.startDate]);

  const tickFrequency = React.useMemo(() => {
    if (isBefore(props.startDate, getUnixTime(subMonths(today, 6)))) {
      return 'every month';
    } else if (isBefore(props.startDate, getUnixTime(subMonths(today, 1)))) {
      return 'every week';
    }

    return 'every day';
  }, [props.startDate, today]);

  // const scaleButtonHandler = (type: 'linear' | 'log') => {
  //   setYScaleType(type === 'linear' ? 'log' : 'linear');
  // };

  const chartColor = theme.mode === 'light' ? 'set2' : 'accent'; // https://nivo.rocks/guides/colors/

  const legendTextColor = theme.mainColors.textColor;

  return (
    <>
      <S.Chart>
        <S.ControlBox>
          Zoom:
          {historicalDates.map((item, index) => (
            <S.ChartButton
              kind={item.active ? 'success' : 'secondary'}
              disabled={item.disabled}
              size="small"
              key={index}
              onClick={() => props.triggerFunction(item.timeStamp)}
            >
              {item.label}
            </S.ChartButton>
          ))}
          <S.ChartButton
            kind={props.startDate === 0 ? 'success' : 'secondary'}
            size="small"
            onClick={() => props.triggerFunction(0)}
          >
            All time
          </S.ChartButton>
          {/* <S.ChartButton size="small" onClick={() => scaleButtonHandler(yScaleType)}>
            {yScaleType === 'linear' ? 'Log Scale' : 'Linear Scale'}
          </S.ChartButton> */}
        </S.ControlBox>

        {props.loading ? (
          <Spinner />
        ) : (
          <ResponsiveLine
            data={props.chartData?.data ?? []}
            theme={theme.chartColors}
            colors={{ scheme: chartColor }} // data colors
            animate={false}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }} // format: 'native', precision: 'day' }}
            xFormat="time: %Y-%m-%d"
            yScale={yScale}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              legend: 'Date',
              legendPosition: 'end',
              legendOffset: -10,
              format: '%d %b',
              orient: 'bottom',
              tickValues: tickFrequency,
              tickSize: 5,
              tickPadding: 10,
              tickRotation: 45,
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: 10,
              legendPosition: 'end',
              legend: 'Price (ETH)',
            }}
            sliceTooltip={({ slice }) => {
              return (
                <S.ToolTipContainer>
                  <S.ToolTipText>Date: {slice.points[0].data.xFormatted}</S.ToolTipText>
                  {slice.points.map(point => (
                    <S.ToolTipText
                      key={point.id}
                      style={{
                        color: point.serieColor,
                        padding: '3px 0',
                      }}
                    >
                      <strong>{point.serieId}:</strong> {point.data.yFormatted}
                    </S.ToolTipText>
                  ))}
                </S.ToolTipContainer>
              );
            }}
            enableSlices={'x'} // enables tool tip display of data at each point of axis passed
            enableCrosshair={true} // enables a crosshair for the tooltip
            crosshairType="cross" // sets the type of crosshair (though I can't get it to change)
            enablePoints={false} // enables point graphics for each data point (defaults to true)
            enableArea={areaProp} // fills in the area below the lines
            areaOpacity={1} // opacity of the area underneath the lines
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 110,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemTextColor: legendTextColor,
                itemWidth: 100,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                padding: { top: 24 },
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        )}
      </S.Chart>
    </>
  );
};
