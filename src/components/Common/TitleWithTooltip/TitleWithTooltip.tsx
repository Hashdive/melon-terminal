import React from 'react';
import { SectionTitleContainer, Title } from '~/storybook/Title/Title';
import { TooltipContainer, Tooltip } from '~/storybook/Tooltip/Tooltip';
import { FaRegQuestionCircle } from 'react-icons/fa';

interface TitleWithTooltipProps {
  title: string;
  placement:
    | 'auto'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'auto-start'
    | 'auto-end'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
    | undefined;
  tooltipValue: string;
}

export const TitleWithTooltip: React.FC<TitleWithTooltipProps> = (props) => {
  return (
    <SectionTitleContainer>
      <Title>{props.title}</Title>
      <TooltipContainer>
        <Tooltip placement={props.placement} value={props.tooltipValue}>
          <FaRegQuestionCircle />
        </Tooltip>
      </TooltipContainer>
    </SectionTitleContainer>
  );
};
