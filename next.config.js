const withSvgr = require("next-plugin-svgr");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // todo: turn this back on when upstream issue is fixed
  // see https://github.com/rainbow-me/rainbowkit/issues/836
  reactStrictMode: false,
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
  async redirects() {
    return [
      {
        source: "/request",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = withSvgr(nextConfig);
