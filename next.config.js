/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // The dapp is deprecated: any path that isn't a real file or route
      // (old deeplinks, /propose, /settled, /request, ...) renders the
      // deprecation page at "/". Fallback rewrites run after pages, API routes
      // and public files, so /api/get-voting-info and static assets still work.
      fallback: [
        {
          source: "/:path*",
          destination: "/",
        },
      ],
    };
  },
};

module.exports = nextConfig;
