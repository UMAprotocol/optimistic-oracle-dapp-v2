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

export const skinnyProposePriceAbi = [
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
      { internalType: "int256", name: "proposedPrice", type: "int256" },
    ],
    name: "proposePrice",
    outputs: [{ internalType: "uint256", name: "totalBond", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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

export const ogAbi = [
  {
    inputs: [],
    name: "rules",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const ratedAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "_bondAmount", type: "uint256" },
      { internalType: "uint64", name: "_challengeWindow", type: "uint64" },
      { internalType: "address", name: "_bondCurrency", type: "address" },
      { internalType: "address", name: "_proposer", type: "address" },
      { internalType: "address", name: "_oracle", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "amountCanNotBeZero", type: "error" },
  { inputs: [], name: "canNotBeAddressZero", type: "error" },
  { inputs: [], name: "invalidChallengeWindow", type: "error" },
  { inputs: [], name: "proposerNotApproved", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_newBondAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "_newCurrency",
        type: "address",
      },
    ],
    name: "NewBondSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "_newChallengeWindow",
        type: "uint64",
      },
    ],
    name: "NewChallengeWindowSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "_timeToSettle",
        type: "uint64",
      },
    ],
    name: "NewTimeToSettleSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_proposerApproved",
        type: "address",
      },
    ],
    name: "ProposerApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_proposerRevoked",
        type: "address",
      },
    ],
    name: "ProposerRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_reportID",
        type: "uint256",
      },
    ],
    name: "reportDiscarded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_reportID",
        type: "uint256",
      },
    ],
    name: "reportDisputed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_reportID",
        type: "uint256",
      },
    ],
    name: "reportMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_reportID",
        type: "uint256",
      },
    ],
    name: "reportSettled",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "approveProposer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "approvedProposer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bondAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bondCurrency",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "challengeWindow",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_newBondAmount", type: "uint256" },
      {
        internalType: "contract IERC20",
        name: "_newCurrency",
        type: "address",
      },
    ],
    name: "changeBondAmountAndCurrency",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "disputedReportsID",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "_pubkey", type: "bytes" }],
    name: "getPubkeyRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_validatorIdentifier",
        type: "bytes32",
      },
    ],
    name: "getViolationsForValidator",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "validatorIdentifier",
            type: "bytes32",
          },
          { internalType: "uint32", name: "epochNumber", type: "uint32" },
          { internalType: "uint32", name: "penaltyType", type: "uint32" },
          {
            internalType: "address",
            name: "newFeeRecipientAddress",
            type: "address",
          },
        ],
        internalType: "struct RatedOracle.Violation[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_reportID", type: "uint256" }],
    name: "getViolationsInReport",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "validatorIdentifier",
            type: "bytes32",
          },
          { internalType: "uint32", name: "epochNumber", type: "uint32" },
          { internalType: "uint32", name: "penaltyType", type: "uint32" },
          {
            internalType: "address",
            name: "newFeeRecipientAddress",
            type: "address",
          },
        ],
        internalType: "struct RatedOracle.Violation[]",
        name: "containedViolation",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_validatorIdentifier",
        type: "bytes32",
      },
    ],
    name: "isValidatorInDispute",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_validatorIdentifier",
        type: "bytes32",
      },
    ],
    name: "numberOfViolationsForValidator",
    outputs: [{ internalType: "uint256", name: "len", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "pendingReportsID",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "_fromEpoch", type: "uint32" },
      { internalType: "uint32", name: "_toEpoch", type: "uint32" },
      {
        components: [
          {
            internalType: "bytes32",
            name: "validatorIdentifier",
            type: "bytes32",
          },
          { internalType: "uint32", name: "epochNumber", type: "uint32" },
          { internalType: "uint32", name: "penaltyType", type: "uint32" },
          {
            internalType: "address",
            name: "newFeeRecipientAddress",
            type: "address",
          },
        ],
        internalType: "struct RatedOracle.Violation[]",
        name: "_listViolations",
        type: "tuple[]",
      },
    ],
    name: "postReport",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "priceIdentifier",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint64", name: "_index", type: "uint64" }],
    name: "removeDisputedReport",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reportID",
    outputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "reports",
    outputs: [
      { internalType: "uint32", name: "fromEpoch", type: "uint32" },
      { internalType: "uint32", name: "toEpoch", type: "uint32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes32", name: "assertionID", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "revokeProposer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "_newChallengeWindow", type: "uint64" },
    ],
    name: "setChallengeWindow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint64", name: "_timeToSettle", type: "uint64" }],
    name: "setTimeToSettle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "timeToSettle",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes32", name: "", type: "bytes32" },
    ],
    name: "validatorInReport",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "violationsForValidator",
    outputs: [
      { internalType: "bytes32", name: "validatorIdentifier", type: "bytes32" },
      { internalType: "uint32", name: "epochNumber", type: "uint32" },
      { internalType: "uint32", name: "penaltyType", type: "uint32" },
      {
        internalType: "address",
        name: "newFeeRecipientAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_to", type: "address" },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const polymarketBulletinAbi = [
  {
    inputs: [
      { internalType: "address", name: "_ctf", type: "address" },
      { internalType: "address", name: "_finder", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "Flagged", type: "error" },
  { inputs: [], name: "Initialized", type: "error" },
  { inputs: [], name: "InvalidAncillaryData", type: "error" },
  { inputs: [], name: "InvalidOOPrice", type: "error" },
  { inputs: [], name: "InvalidPayouts", type: "error" },
  { inputs: [], name: "NotAdmin", type: "error" },
  { inputs: [], name: "NotFlagged", type: "error" },
  { inputs: [], name: "NotInitialized", type: "error" },
  { inputs: [], name: "NotOptimisticOracle", type: "error" },
  { inputs: [], name: "NotReadyToResolve", type: "error" },
  { inputs: [], name: "Paused", type: "error" },
  { inputs: [], name: "PriceNotAvailable", type: "error" },
  { inputs: [], name: "Resolved", type: "error" },
  { inputs: [], name: "SafetyPeriodNotPassed", type: "error" },
  { inputs: [], name: "UnsupportedToken", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      { indexed: false, internalType: "bytes", name: "update", type: "bytes" },
    ],
    name: "AncillaryDataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdminAddress",
        type: "address",
      },
    ],
    name: "NewAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "payouts",
        type: "uint256[]",
      },
    ],
    name: "QuestionEmergencyResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
    ],
    name: "QuestionFlagged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "requestTimestamp",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "ancillaryData",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "rewardToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalBond",
        type: "uint256",
      },
    ],
    name: "QuestionInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
    ],
    name: "QuestionPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
    ],
    name: "QuestionReset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "int256",
        name: "settledPrice",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "payouts",
        type: "uint256[]",
      },
    ],
    name: "QuestionResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionID",
        type: "bytes32",
      },
    ],
    name: "QuestionUnpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "removedAdmin",
        type: "address",
      },
    ],
    name: "RemovedAdmin",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "admin", type: "address" }],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "admins",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralWhitelist",
    outputs: [
      { internalType: "contract IAddressWhitelist", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ctf",
    outputs: [
      {
        internalType: "contract IConditionalTokens",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "questionID", type: "bytes32" },
      { internalType: "uint256[]", name: "payouts", type: "uint256[]" },
    ],
    name: "emergencyResolve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencySafetyPeriod",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "flag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "getExpectedPayouts",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "questionID", type: "bytes32" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "getLatestUpdate",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bytes", name: "update", type: "bytes" },
        ],
        internalType: "struct BulletinBoard.AncillaryDataUpdate",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "getQuestion",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "requestTimestamp",
            type: "uint256",
          },
          { internalType: "uint256", name: "reward", type: "uint256" },
          { internalType: "uint256", name: "proposalBond", type: "uint256" },
          {
            internalType: "uint256",
            name: "emergencyResolutionTimestamp",
            type: "uint256",
          },
          { internalType: "bool", name: "resolved", type: "bool" },
          { internalType: "bool", name: "paused", type: "bool" },
          { internalType: "bool", name: "reset", type: "bool" },
          { internalType: "address", name: "rewardToken", type: "address" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "bytes", name: "ancillaryData", type: "bytes" },
        ],
        internalType: "struct QuestionData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "questionID", type: "bytes32" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "getUpdates",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bytes", name: "update", type: "bytes" },
        ],
        internalType: "struct BulletinBoard.AncillaryDataUpdate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
      { internalType: "address", name: "rewardToken", type: "address" },
      { internalType: "uint256", name: "reward", type: "uint256" },
      { internalType: "uint256", name: "proposalBond", type: "uint256" },
    ],
    name: "initialize",
    outputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "isAdmin",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "isFlagged",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "isInitialized",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxAncillaryData",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "optimisticOracle",
    outputs: [
      {
        internalType: "contract IOptimisticOracleV2",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "questionID", type: "bytes32" },
      { internalType: "bytes", name: "update", type: "bytes" },
    ],
    name: "postUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "priceDisputed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "questions",
    outputs: [
      { internalType: "uint256", name: "requestTimestamp", type: "uint256" },
      { internalType: "uint256", name: "reward", type: "uint256" },
      { internalType: "uint256", name: "proposalBond", type: "uint256" },
      {
        internalType: "uint256",
        name: "emergencyResolutionTimestamp",
        type: "uint256",
      },
      { internalType: "bool", name: "resolved", type: "bool" },
      { internalType: "bool", name: "paused", type: "bool" },
      { internalType: "bool", name: "reset", type: "bool" },
      { internalType: "address", name: "rewardToken", type: "address" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "ready",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "admin", type: "address" }],
    name: "removeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "reset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "resolve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "questionID", type: "bytes32" }],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "updates",
    outputs: [
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes", name: "update", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "yesOrNoIdentifier",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const getProposerWhitelistWithEnforcementStatusAbi = [
  {
    inputs: [
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "bytes", name: "ancillaryData", type: "bytes" },
    ],
    name: "getProposerWhitelistWithEnforcementStatus",
    outputs: [
      {
        internalType: "address[]",
        name: "allowedProposers",
        type: "address[]",
      },
      { internalType: "bool", name: "isEnforced", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
