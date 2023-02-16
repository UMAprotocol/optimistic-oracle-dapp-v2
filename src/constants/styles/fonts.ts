import { css } from "styled-components";

const weight = 400;

export const family = "'Halyard Display', sans-serif";

export const subHeader = `${weight} ${16 / 16}rem/19px ${family}`;
export const subHeaderSm = `${weight} ${12 / 16}rem/16px ${family}`;
export const headerLg = `${weight} ${96 / 16}rem/112px ${family}`;
export const headerMd = `${weight} ${64 / 16}rem/72px ${family}`;
export const headerSm = `${weight} ${40 / 16}rem/54px ${family}`;
export const headerXs = `${weight} ${32 / 16}rem/44px ${family}`;

// 64.00px → 96.00px
export const headerLgFluidFontSize = `
clamp(4.00rem, calc(3.35rem + 3.27vw), 6.00rem)
`;

// 72.00px → 112.00px
export const headerLgFluidLineHeight = `
clamp(4.50rem, calc(3.68rem + 4.08vw), 7.00rem)
`;

export const headerLgFluid = css`
  font-size: ${headerLgFluidFontSize};
  line-height: ${headerLgFluidLineHeight};
`;

export const headerMdFluidFontSize = `
clamp(2.50rem, calc(2.01rem + 2.45vw), 4.00rem)
`;

export const headerMdFluidLineHeight = `
clamp(3.38rem, calc(3.01rem + 1.84vw), 4.50rem)
`;

export const headerMdFluid = css`
  font-size: ${headerMdFluidFontSize};
  line-height: ${headerMdFluidLineHeight};
`;

export const headerSmFluidFontSize = `
clamp(2.00rem, calc(1.84rem + 0.82vw), 2.50rem)
`;

export const headerSmFluidLineHeight = `
clamp(3.38rem, calc(3.01rem + 1.84vw), 4.50rem)
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
