const withSvgr = require("next-plugin-svgr");

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { styledComponents: true },
  svgrOptions: {
    svgoConfig: {
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    },
  },
};

module.exports = withSvgr(nextConfig);
