import styled, { css } from 'styled-components';

export interface InputProps {
  error?: boolean;
}

export const InputWrapper = styled.div`
  margin-bottom: ${props => props.theme.spaceUnits.l};
`;

export const InputLabel = styled.span`
  display: inline-block;
  margin-bottom: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.mainColors.primaryDark};
  font-size: ${props => props.theme.fontSizes.m};
`;

export const InputError = styled.span`
  display: inline-block;
  margin-top: ${props => props.theme.spaceUnits.xs};
  color: ${props => props.theme.statusColors.primaryLoss};
  font-size: ${props => props.theme.fontSizes.s};
`;

export const Input = styled.input<InputProps>`
  position: relative;
  width: 100%;
  padding: 0px ${props => props.theme.spaceUnits.m};
  border: 1px solid ${props => props.theme.mainColors.secondaryDarkAlpha};
  border-radius: 0;
  font-family: inherit;
  font-size: ${props => props.theme.fontSizes.m};
  background: ${props => props.theme.mainColors.primary};
  height: ${props => props.theme.spaceUnits.xxl};
  box-shadow: inset 1px 4px 4px rgba(200, 200, 200, 0.25);

  &::placeholder {
    color: ${props => props.theme.mainColors.secondaryDarkAlpha};
    font-size: ${props => props.theme.fontSizes.s};
  }

  &:focus {
    outline-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
  }

  ${props => {
    if (props.disabled) {
      return css`
        background: ${props => props.theme.mainColors.secondary};
        border-color: ${props => props.theme.mainColors.secondaryDarkAlpha};
        pointer-events: none;
      `;
    }
  }}

  ${props => {
    if (props.error) {
      return css`
        border-color: ${props => props.theme.statusColors.primaryLoss};
      `;
    }
  }}
`;
