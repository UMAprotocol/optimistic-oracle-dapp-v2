import type {
  chainNames,
  chainsById,
  expiryTypes,
  oracleTypes,
  projects,
  requestStates,
} from "@shared/constants";

export type OracleTypes = typeof oracleTypes;

export type OracleType = OracleTypes[number];

export type RequestStates = typeof requestStates;

export type RequestState = RequestStates[number];

export type ChainsById = typeof chainsById;

export type ChainId = keyof ChainsById;

export type ChainNames = typeof chainNames;

export type ChainName = ChainNames[number];

export type ExpiryTypes = typeof expiryTypes;

export type ExpiryType = ExpiryTypes[number];

export type Projects = typeof projects;

export type Project = Projects[number];

export type PageName = "verify" | "propose" | "settled";

export type Token = {
  chainId: number;
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
};
export type Tokens = Token[];

export type Balance = {
  chainId: number;
  account: string;
  amount: string;
  tokenAddress: string;
};
export type Balances = Balance[];

export type Allowance = Balance & {
  spender: string;
};
export type Allowances = Allowance[];

export type Transaction = {
  id: string;
  state: "created" | "confirmed" | "submitted" | "error";
  error?: Error;
};
export type Transactions = Transaction[];
