import React, { useState } from 'react';
import { GiAtlas, GiCaesar, GiCentaur, GiPegasus, GiSpartan, GiTrident, GiInfo } from 'react-icons/gi';
import styled from 'styled-components';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';

const BadgeIcon = styled.div`
  padding: 2px;
  background-color: ${(props) => props.theme.mainColors.secondary};
  float: left;
  margin: 0;
  vertical-align: bottom;
`;

const BadgeText = styled.div`
  padding-left: 5px;
  float: right;
  vertical-align: bottom;
`;

const BadgeWrapper = styled.div`
  background-color: ${(props) => props.theme.mainColors.secondary};
  vertical-align: middle;
  width: 100%;
`;

interface FundBadgesOverviewProps {
  setShowDirectory: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FundBadgesOverview: React.FC<FundBadgesOverviewProps> = (props) => {
  return (
    <Block>
      <SectionTitle>
        Badges of Honour <GiInfo onClick={() => props.setShowDirectory(true)} />
      </SectionTitle>
      <Grid noGap={true}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiCaesar title="Largest fund" size="3rem" />
              </BadgeIcon>
              <BadgeText>Rhino Fund</BadgeText>
            </BadgeWrapper>
          </GridCol>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiTrident title="Trident" size="3rem" color="#C9B037" />
              </BadgeIcon>
              <BadgeText>Fund 1</BadgeText>
            </BadgeWrapper>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiPegasus title="Pegasus" size="3rem" color="#C9B037" />
              </BadgeIcon>
              Fund 3
            </BadgeWrapper>
          </GridCol>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiAtlas title="Atlas" size="3rem" color="#C9B037" />
              </BadgeIcon>
              Fund 4
            </BadgeWrapper>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiSpartan title="Spartan" size="3rem" color="#C9B037" />
              </BadgeIcon>
              Fund 5
            </BadgeWrapper>
          </GridCol>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiCentaur title="Centaur" size="3rem" color="#C9B037" />
              </BadgeIcon>
              Fund 6
            </BadgeWrapper>
          </GridCol>
        </GridRow>
      </Grid>
    </Block>
  );
};
