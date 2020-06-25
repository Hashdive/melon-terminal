import React from 'react';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';

interface FundBadgeDetailsProps {
  setShowDirectory: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FundBadgeDirectory: React.FC<FundBadgeDetailsProps> = (props) => {
  return (
    <Block>
      <SectionTitle>Badge Directory</SectionTitle>
      <div onClick={() => props.setShowDirectory(false)}>Back to main</div>
    </Block>
  );
};
