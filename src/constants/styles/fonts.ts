import { css } from "styled-components";

const weight = 400;

export const family = "'Halyard Display', sans-serif";

export const subHeader = `${weight} ${16 / 16}rem/19px ${family}`;
export const subHeaderSm = `${weight} ${12 / 16}rem/16px ${family}`;
export const headerLg = `${weight} ${96 / 16}rem/112px ${family}`;
export const headerMd = `${weight} ${64 / 16}rem/72px ${family}`;
export const headerSm = `${weight} ${40 / 16}rem/55px ${family}`;
export const headerXs = `${weight} ${32 / 16}rem/45px ${family}`;

export const headerLgFluidFontSize = `
  clamp(${64 / 16}rem, 6vw + 2rem, ${96 / 16}rem)
`;

export const headerLgFluidLineHeight = `
  clamp(72px, 6vw + 2rem, 112px)
`;

export const headerLgFluid = css`
  font-size: ${headerLgFluidFontSize};
  line-height: ${headerLgFluidLineHeight};
`;

export const headerMdFluidFontSize = `
  clamp(${64 / 16}rem, 6vw + 2rem, ${96 / 16}rem)
`;

export const headerMdFluidLineHeight = `
  clamp(72px, 6vw + 2rem, 112px)
`;

export const headerMdFluid = css`
  font-size: ${headerMdFluidFontSize};
  line-height: ${headerMdFluidLineHeight};
`;

export const headerSmFluidFontSize = `
  clamp(${40 / 16}rem, 7vw + 1.18rem, ${64 / 16}rem)
`;

export const headerSmFluidLineHeight = `
  clamp(55px, 5vw + 2.5rem, 72px)
`;

export const headerSmFluid = css`
  font-size: ${headerSmFluidFontSize};
  line-height: ${headerSmFluidLineHeight};
`;

export const bodyXl = `${weight} ${26 / 16}rem/32px ${family}`;
export const bodyLg = `${weight} ${20 / 16}rem/28px ${family}`;
export const bodyMd = `${weight} ${18 / 16}rem/24px ${family}`;
export const bodySm = `${weight} ${16 / 16}rem/22px ${family}`;
export const bodyXs = `${weight} ${12 / 16}rem/17px ${family}`;
