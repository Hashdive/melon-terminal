import React, { useState } from 'react';
import { GiAtlas, GiCaesar, GiCentaur, GiPegasus, GiSpartanHelmet, GiTrojanHorse, GiInfo } from 'react-icons/gi';
import styled from 'styled-components';
import { Block } from '~/storybook/Block/Block';
import { Grid, GridCol, GridRow } from '~/storybook/Grid/Grid';
import { SectionTitle } from '~/storybook/Title/Title';

const BadgeIcon = styled.div`
  padding: 2px 10px 0px 2px;
  background-color: ${(props) => props.theme.mainColors.secondary};
  float: left;
  margin: 0;
  vertical-align: bottom;
`;

const BadgeText = styled.div`
  padding-left: 10px;
  float: right;
`;

const BadgeTextFundName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xxl};
`;

const BadgeTextBadgeName = styled.div`
  font-size: ${(props) => props.theme.fontSizes.s};
`;

const BadgeWrapper = styled.div`
  background-color: ${(props) => props.theme.mainColors.secondary};
  vertical-align: middle;
  width: 100%;
  display: flex;
  align-items: center;
`;

interface FundBadgesOverviewProps {
  setShowDirectory: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FundBadgesOverview: React.FC<FundBadgesOverviewProps> = (props) => {
  return (
    <Block>
      <SectionTitle>
        Melon Leaderboard <GiInfo onClick={() => props.setShowDirectory(true)} />
      </SectionTitle>
      <Grid noGap={true}>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiCaesar title="Largest fund" size="4rem" />
              </BadgeIcon>
              <BadgeText>
                <BadgeTextFundName>Rhino Fund</BadgeTextFundName>
                <BadgeTextBadgeName>Highest AUM</BadgeTextBadgeName>
              </BadgeText>
            </BadgeWrapper>
          </GridCol>{' '}
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiSpartanHelmet title="Spartan" size="4rem" />
              </BadgeIcon>
              <BadgeText>
                <BadgeTextFundName>Rhino Fund</BadgeTextFundName>
                <BadgeTextBadgeName>Best MTD performance</BadgeTextBadgeName>
              </BadgeText>
            </BadgeWrapper>
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiPegasus title="Pegasus" size="4rem" />
              </BadgeIcon>
              <BadgeText>
                <BadgeTextFundName>Rhino Fund</BadgeTextFundName>
                <BadgeTextBadgeName>Best 1d performance</BadgeTextBadgeName>
              </BadgeText>
            </BadgeWrapper>
          </GridCol>
          <GridCol xs={12} sm={6}>
            <BadgeWrapper>
              <BadgeIcon>
                <GiAtlas title="Atlas" size="4rem" />
              </BadgeIcon>
              <BadgeText>
                <BadgeTextFundName>Full Auto Luxury Space Communism</BadgeTextFundName>
                <BadgeTextBadgeName>Latest launch</BadgeTextBadgeName>
              </BadgeText>
            </BadgeWrapper>
          </GridCol>
        </GridRow>
      </Grid>
    </Block>
  );
};
