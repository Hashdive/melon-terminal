import React from 'react';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';

export const FundBadges: React.FC = () => {
  return (
    <Block>
      <SectionTitle>Badges of Honour</SectionTitle>
      <p>Best 1D performance</p>
      <p>Best MTD performance</p>
      <p>Best YTD performance</p>
      <p>Most number of positive months</p>
      <p>Largest fund</p>
    </Block>
  );
};
