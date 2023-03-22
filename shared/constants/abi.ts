export const proposePriceAbi = [
  {
    inputs: [
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
      { internalType: "int256", name: "proposedPrice", type: "int256" },
    ],
    name: "proposePrice",
    outputs: [{ internalType: "uint256", name: "totalBond", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const skinnyProposePriceAbi = [{
  inputs: [
    { internalType: "address", name: "requester", type: "address" },
    { internalType: "bytes32", name: "identifier", type: "bytes32" },
    { internalType: "uint32", name: "timestamp", type: "uint32" },
    { internalType: "bytes", name: "ancillaryData", type: "bytes" },
    {
      components: [
        { internalType: "address", name: "proposer", type: "address" },
        { internalType: "address", name: "disputer", type: "address" },
        {
          internalType: "contract IERC20",
          name: "currency",
          type: "address",
        },
        { internalType: "bool", name: "settled", type: "bool" },
        { internalType: "int256", name: "proposedPrice", type: "int256" },
        { internalType: "int256", name: "resolvedPrice", type: "int256" },
        { internalType: "uint256", name: "expirationTime", type: "uint256" },
        { internalType: "uint256", name: "reward", type: "uint256" },
        { internalType: "uint256", name: "finalFee", type: "uint256" },
        { internalType: "uint256", name: "bond", type: "uint256" },
        { internalType: "uint256", name: "customLiveness", type: "uint256" },
      ],
      internalType: "struct SkinnyOptimisticOracleInterface.Request",
      name: "request",
      type: "tuple",
    },
    { internalType: "int256", name: "proposedPrice", type: "int256" },
  ],
  name: "proposePrice",
  outputs: [{ internalType: "uint256", name: "totalBond", type: "uint256" }],
  stateMutability: "nonpayable",
  type: "function",
}];

export const disputePriceAbi = [
  {
    inputs: [
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
    ],
    name: "disputePrice",
    outputs: [{ internalType: "uint256", name: "totalBond", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const skinnyDisputePriceAbi = [
  {
    inputs: [
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "uint32", name: "timestamp", type: "uint32" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
      {
        components: [
          { internalType: "address", name: "proposer", type: "address" },
          { internalType: "address", name: "disputer", type: "address" },
          {
            internalType: "contract IERC20",
            name: "currency",
            type: "address",
          },
          { internalType: "bool", name: "settled", type: "bool" },
          { internalType: "int256", name: "proposedPrice", type: "int256" },
          { internalType: "int256", name: "resolvedPrice", type: "int256" },
          { internalType: "uint256", name: "expirationTime", type: "uint256" },
          { internalType: "uint256", name: "reward", type: "uint256" },
          { internalType: "uint256", name: "finalFee", type: "uint256" },
          { internalType: "uint256", name: "bond", type: "uint256" },
          { internalType: "uint256", name: "customLiveness", type: "uint256" },
        ],
        internalType: "struct SkinnyOptimisticOracleInterface.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "disputePrice",
    outputs: [{ internalType: "uint256", name: "totalBond", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const settlePriceAbi = [
  {
    inputs: [
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
    ],
    name: "settle",
    outputs: [{ internalType: "uint256", name: "payout", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const skinnySettlePriceAbi = [
  {
    inputs: [
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "uint32", name: "timestamp", type: "uint32" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
      {
        components: [
          { internalType: "address", name: "proposer", type: "address" },
          { internalType: "address", name: "disputer", type: "address" },
          {
            internalType: "contract IERC20",
            name: "currency",
            type: "address",
          },
          { internalType: "bool", name: "settled", type: "bool" },
          { internalType: "int256", name: "proposedPrice", type: "int256" },
          { internalType: "int256", name: "resolvedPrice", type: "int256" },
          { internalType: "uint256", name: "expirationTime", type: "uint256" },
          { internalType: "uint256", name: "reward", type: "uint256" },
          { internalType: "uint256", name: "finalFee", type: "uint256" },
          { internalType: "uint256", name: "bond", type: "uint256" },
          { internalType: "uint256", name: "customLiveness", type: "uint256" },
        ],
        internalType: "struct SkinnyOptimisticOracleInterface.Request",
        name: "request",
        type: "tuple",
      },
    ],
    name: "settle",
    outputs: [
      { internalType: "uint256", name: "payout", type: "uint256" },
      { internalType: "int256", name: "resolvedPrice", type: "int256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const disputeAssertionAbi = [
  {
    inputs: [
      { internalType: "bytes32", name: "assertionId", type: "bytes32" },
      { internalType: "address", name: "disputer", type: "address" },
    ],
    name: "disputeAssertion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const settleAssertionAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "assertionId", type: "bytes32" }],
    name: "settleAssertion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
