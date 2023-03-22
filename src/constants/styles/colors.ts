import { addOpacityToHsla } from "@/helpers";

export const red100 = "hsla(0, 100%, 96%, 1)"; // #FFEBEB
export const red500 = "hsla(0, 100%, 65%, 1)"; // #ff4d4d
export const red500Opacity5 = addOpacityToHsla(red500, 0.05);
export const red500Opacity15 = addOpacityToHsla(red500, 0.15);
export const red600 = "hsla(0, 79%, 59%, 1)"; // #E94444
export const blueGrey300 = "hsla(255, 3%, 69%, 1)"; // #b0afb3
export const blueGrey400 = "hsla(255, 2%, 64%, 1)"; // #a3a2a6
export const blueGrey500 = "hsla(288, 4%, 25%, 1)"; // #413d42
export const blueGrey600 = "hsla(285, 4%, 19%, 1)"; // #322f33
export const blueGrey700 = "hsla(280, 4%, 15%, 1)"; // #272528
export const grey50 = "hsla(0, 0%, 99%, 1)"; // #fdfdfd
export const grey100 = "hsla(0, 0%, 98%, 1)"; // #fafafa
export const grey400 = "hsla(0, 0%, 94%, 1)"; // #f0f0f0
export const grey500 = "hsla(0, 0%, 91%, 1)"; // #e9e9e9
export const grey900 = "hsla(0, 0%, 12%, 1)"; // #1f1f1f
export const white = "hsla(0, 0%, 100%, 1)"; // #ffffff
export const darkText = blueGrey700;
export const lightText = white;
