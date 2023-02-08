import * as ss from "superstruct";

const Env = ss.object({
  NEXT_PUBLIC_DEFAULT_APY: ss.optional(ss.string()),
  NEXT_PUBLIC_INFURA_ID: ss.string(),
});
export type Env = ss.Infer<typeof Env>;

const Config = ss.object({
  defaultApy: ss.string(),
  infuraId: ss.string(),
});
export type Config = ss.Infer<typeof Config>;

// every prop of next envs needs to be explicitly pulled in
const env = ss.create(
  {
    NEXT_PUBLIC_DEFAULT_APY: process.env.NEXT_PUBLIC_DEFAULT_APY,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
  },
  Env
);

function parseEnv(env: Env): Config {
  return {
    defaultApy: env.NEXT_PUBLIC_DEFAULT_APY ?? "30.1",
    infuraId: env.NEXT_PUBLIC_INFURA_ID,
  };
}

export const config = parseEnv(env);
