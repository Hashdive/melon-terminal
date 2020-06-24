import React from 'react';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';
import { GiPodium } from 'react-icons/gi';

interface FundBadgeDetailsProps {
  badge: string;
  setBadge: React.Dispatch<React.SetStateAction<string>>;
}

export const FundBadgeDetails: React.FC<FundBadgeDetailsProps> = (props) => {
  return (
    <Block>
      <SectionTitle>Badge: {props.badge}</SectionTitle>
      <GiPodium size="4rem" />
      <div onClick={() => props.setBadge('overview')}>Back to overview</div>
    </Block>
  );
};
