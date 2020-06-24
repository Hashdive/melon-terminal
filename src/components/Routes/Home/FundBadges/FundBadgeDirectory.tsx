import React from 'react';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';

interface FundBadgeDetailsProps {
  setBadge: React.Dispatch<React.SetStateAction<string>>;
}

export const FundBadgeDirectory: React.FC<FundBadgeDetailsProps> = (props) => {
  return (
    <Block>
      <SectionTitle>Badge Directory</SectionTitle>
      <div onClick={() => props.setBadge('overview')}>Back to main</div>
    </Block>
  );
};
