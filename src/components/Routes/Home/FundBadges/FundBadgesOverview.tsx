import React, { useState } from 'react';
import { GiAtlas, GiCaesar, GiCentaur, GiPegasus, GiSpartan, GiTrident, GiInfo } from 'react-icons/gi';
import styled from 'styled-components';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';

const IconWrapper = styled.div`
  margin: 0 auto;
`;

const CenteredGridCol = styled(GridCol)`
  text-align: center;
  cursor: pointer;
`;

const GridRowWithPadding = styled(GridRow)`
  padding-top: 0px;
`;

const BadgeWrapper = styled.div``;

interface FundBadgesOverviewProps {
  setBadge: React.Dispatch<React.SetStateAction<string>>;
}

export const FundBadgesOverview: React.FC<FundBadgesOverviewProps> = (props) => {
  return (
    <Block>
      <SectionTitle>
        Badges of Honour <GiInfo onClick={() => props.setBadge('directory')} />
      </SectionTitle>
      <Grid noGap={true}>
        <GridRowWithPadding>
          <CenteredGridCol xs={12} sm={6}>
            <BadgeWrapper onClick={() => props.setBadge('caesar')}>
              <IconWrapper>
                <GiCaesar title="Largest fund" size="3rem" color="#C9B037" />
              </IconWrapper>
              Rhino Fund
            </BadgeWrapper>
          </CenteredGridCol>
          <CenteredGridCol xs={12} sm={6}>
            <BadgeWrapper onClick={() => props.setBadge('trident')}>
              <IconWrapper>
                <GiTrident title="Trident" size="3rem" color="#C9B037" />
              </IconWrapper>
              Fund 1
            </BadgeWrapper>
          </CenteredGridCol>
        </GridRowWithPadding>
        <GridRowWithPadding>
          <CenteredGridCol xs={12} sm={6}>
            <BadgeWrapper onClick={() => props.setBadge('pegasus')}>
              <IconWrapper>
                <GiPegasus title="Pegasus" size="3rem" color="#C9B037" />
              </IconWrapper>
              Fund 3
            </BadgeWrapper>
          </CenteredGridCol>
          <CenteredGridCol xs={12} sm={6}>
            <BadgeWrapper onClick={() => props.setBadge('atlas')}>
              <IconWrapper>
                <GiAtlas title="Atlas" size="3rem" color="#C9B037" />
              </IconWrapper>
              Fund 4
            </BadgeWrapper>
          </CenteredGridCol>
        </GridRowWithPadding>
        <GridRowWithPadding>
          <CenteredGridCol xs={12} sm={6}>
            <BadgeWrapper onClick={() => props.setBadge('spartan')}>
              <IconWrapper>
                <GiSpartan title="Spartan" size="3rem" color="#C9B037" />
              </IconWrapper>
              Fund 5
            </BadgeWrapper>
          </CenteredGridCol>
          <CenteredGridCol xs={12} sm={6}>
            <BadgeWrapper onClick={() => props.setBadge('centaur')}>
              <IconWrapper>
                <GiCentaur title="Centaur" size="3rem" color="#C9B037" />
              </IconWrapper>
              Fund 6
            </BadgeWrapper>
          </CenteredGridCol>
        </GridRowWithPadding>
      </Grid>
    </Block>
  );
};
