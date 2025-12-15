// Mock environment variables for tests
// Only set required (non-optional) environment variables
process.env.NEXT_PUBLIC_INFURA_ID =
  process.env.NEXT_PUBLIC_INFURA_ID || "test-infura-id";
process.env.NEXT_PUBLIC_DEFAULT_LIVENESS =
  process.env.NEXT_PUBLIC_DEFAULT_LIVENESS || "3600";
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "test-walletconnect-id";
process.env.NEXT_PUBLIC_SIMULATION_ENDPOINT =
  process.env.NEXT_PUBLIC_SIMULATION_ENDPOINT ||
  "https://test-simulation-endpoint.com";
