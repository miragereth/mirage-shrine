export const MirageShrineABI = [
	{
		"inputs": [
			{
				"internalType": "contract IRealityETH",
				"name": "_reality",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_fateMonument",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_templateId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_arbitrator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tribute",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_minBond",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Offering",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint64",
				"name": "prophecyId",
				"type": "uint64"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "essence",
				"type": "address"
			}
		],
		"name": "Scry",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_prophecy",
				"type": "uint64"
			}
		],
		"name": "ascend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_prophecy",
				"type": "uint64"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "blend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_prophecy",
				"type": "uint64"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "distill",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_prophecy",
				"type": "uint64"
			}
		],
		"name": "emergence",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "prophecies",
		"outputs": [
			{
				"internalType": "contract IERC20Metadata",
				"name": "essence",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "horizon",
				"type": "uint32"
			},
			{
				"internalType": "enum MirageShrine.Aura",
				"name": "aura",
				"type": "uint8"
			},
			{
				"internalType": "contract Fate",
				"name": "no",
				"type": "address"
			},
			{
				"internalType": "contract Fate",
				"name": "yes",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "fateSupply",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "inquiryId",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "relayOffering",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_horizon",
				"type": "uint32"
			},
			{
				"internalType": "contract IERC20Metadata",
				"name": "_essence",
				"type": "address"
			},
			{
				"internalType": "bytes23",
				"name": "_rune",
				"type": "bytes23"
			},
			{
				"internalType": "string",
				"name": "_inquiry",
				"type": "string"
			}
		],
		"name": "scry",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "id",
				"type": "uint64"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
] as const

export const FateABI = [
  {
    inputs: [
      {
        internalType: "contract MirageShrine",
        name: "shrine",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "SHRINE",
    outputs: [
      {
        internalType: "contract MirageShrine",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "info",
    outputs: [
      {
        internalType: "bytes23",
        name: "rune",
        type: "bytes23",
      },
      {
        internalType: "uint64",
        name: "prophecyId",
        type: "uint64",
      },
      {
        internalType: "bool",
        name: "yes",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes23",
        name: "rune",
        type: "bytes23",
      },
      {
        internalType: "uint64",
        name: "id",
        type: "uint64",
      },
      {
        internalType: "bool",
        name: "yes",
        type: "bool",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
  {
    inputs: [],
    name: "symbol",
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
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export const RealityABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "answer_hash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "answer",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bond",
        type: "uint256",
      },
    ],
    name: "LogAnswerReveal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
    ],
    name: "LogCancelArbitration",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogClaim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "answer",
        type: "bytes32",
      },
    ],
    name: "LogFinalize",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bounty_added",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bounty",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "LogFundAnswerBounty",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "min_bond",
        type: "uint256",
      },
    ],
    name: "LogMinimumBond",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "answer",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "history_hash",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "bond",
        type: "uint256",
      },
      { indexed: false, internalType: "uint256", name: "ts", type: "uint256" },
      {
        indexed: false,
        internalType: "bool",
        name: "is_commitment",
        type: "bool",
      },
    ],
    name: "LogNewAnswer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "template_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "content_hash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "arbitrator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "timeout",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "opening_ts",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "created",
        type: "uint256",
      },
    ],
    name: "LogNewQuestion",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "template_id",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "string",
        name: "question_text",
        type: "string",
      },
    ],
    name: "LogNewTemplate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "LogNotifyOfArbitrationRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "question_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "reopened_question_id",
        type: "bytes32",
      },
    ],
    name: "LogReopenQuestion",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "arbitrator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogSetQuestionFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogWithdraw",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "arbitrator_question_fees",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "template_id", type: "uint256" },
      { internalType: "string", name: "question", type: "string" },
      { internalType: "address", name: "arbitrator", type: "address" },
      { internalType: "uint32", name: "timeout", type: "uint32" },
      { internalType: "uint32", name: "opening_ts", type: "uint32" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
    ],
    name: "askQuestion",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "template_id", type: "uint256" },
      { internalType: "string", name: "question", type: "string" },
      { internalType: "address", name: "arbitrator", type: "address" },
      { internalType: "uint32", name: "timeout", type: "uint32" },
      { internalType: "uint32", name: "opening_ts", type: "uint32" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "min_bond", type: "uint256" },
    ],
    name: "askQuestionWithMinBond",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "answer", type: "bytes32" },
      { internalType: "address", name: "payee_if_wrong", type: "address" },
      { internalType: "bytes32", name: "last_history_hash", type: "bytes32" },
      {
        internalType: "bytes32",
        name: "last_answer_or_commitment_id",
        type: "bytes32",
      },
      { internalType: "address", name: "last_answerer", type: "address" },
    ],
    name: "assignWinnerAndSubmitAnswerByArbitrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "cancelArbitration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "question_ids", type: "bytes32[]" },
      { internalType: "uint256[]", name: "lengths", type: "uint256[]" },
      { internalType: "bytes32[]", name: "hist_hashes", type: "bytes32[]" },
      { internalType: "address[]", name: "addrs", type: "address[]" },
      { internalType: "uint256[]", name: "bonds", type: "uint256[]" },
      { internalType: "bytes32[]", name: "answers", type: "bytes32[]" },
    ],
    name: "claimMultipleAndWithdrawBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32[]", name: "history_hashes", type: "bytes32[]" },
      { internalType: "address[]", name: "addrs", type: "address[]" },
      { internalType: "uint256[]", name: "bonds", type: "uint256[]" },
      { internalType: "bytes32[]", name: "answers", type: "bytes32[]" },
    ],
    name: "claimWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "commitments",
    outputs: [
      { internalType: "uint32", name: "reveal_ts", type: "uint32" },
      { internalType: "bool", name: "is_revealed", type: "bool" },
      { internalType: "bytes32", name: "revealed_answer", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "content", type: "string" }],
    name: "createTemplate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "content", type: "string" },
      { internalType: "string", name: "question", type: "string" },
      { internalType: "address", name: "arbitrator", type: "address" },
      { internalType: "uint32", name: "timeout", type: "uint32" },
      { internalType: "uint32", name: "opening_ts", type: "uint32" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
    ],
    name: "createTemplateAndAskQuestion",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "fundAnswerBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getArbitrator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getBestAnswer",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getBond",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getBounty",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getContentHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getFinalAnswer",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "content_hash", type: "bytes32" },
      { internalType: "address", name: "arbitrator", type: "address" },
      { internalType: "uint32", name: "min_timeout", type: "uint32" },
      { internalType: "uint256", name: "min_bond", type: "uint256" },
    ],
    name: "getFinalAnswerIfMatches",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getFinalizeTS",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getHistoryHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getMinBond",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getOpeningTS",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "getTimeout",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "isFinalized",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "isPendingArbitration",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "isSettledTooSoon",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "address", name: "requester", type: "address" },
      { internalType: "uint256", name: "max_previous", type: "uint256" },
    ],
    name: "notifyOfArbitrationRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "question_claims",
    outputs: [
      { internalType: "address", name: "payee", type: "address" },
      { internalType: "uint256", name: "last_bond", type: "uint256" },
      { internalType: "uint256", name: "queued_funds", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "questions",
    outputs: [
      { internalType: "bytes32", name: "content_hash", type: "bytes32" },
      { internalType: "address", name: "arbitrator", type: "address" },
      { internalType: "uint32", name: "opening_ts", type: "uint32" },
      { internalType: "uint32", name: "timeout", type: "uint32" },
      { internalType: "uint32", name: "finalize_ts", type: "uint32" },
      { internalType: "bool", name: "is_pending_arbitration", type: "bool" },
      { internalType: "uint256", name: "bounty", type: "uint256" },
      { internalType: "bytes32", name: "best_answer", type: "bytes32" },
      { internalType: "bytes32", name: "history_hash", type: "bytes32" },
      { internalType: "uint256", name: "bond", type: "uint256" },
      { internalType: "uint256", name: "min_bond", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "template_id", type: "uint256" },
      { internalType: "string", name: "question", type: "string" },
      { internalType: "address", name: "arbitrator", type: "address" },
      { internalType: "uint32", name: "timeout", type: "uint32" },
      { internalType: "uint32", name: "opening_ts", type: "uint32" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "min_bond", type: "uint256" },
      { internalType: "bytes32", name: "reopens_question_id", type: "bytes32" },
    ],
    name: "reopenQuestion",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "reopened_questions",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "reopener_questions",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "resultFor",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "question_id", type: "bytes32" }],
    name: "resultForOnceSettled",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "fee", type: "uint256" }],
    name: "setQuestionFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "answer", type: "bytes32" },
      { internalType: "uint256", name: "max_previous", type: "uint256" },
    ],
    name: "submitAnswer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "answer", type: "bytes32" },
      { internalType: "address", name: "answerer", type: "address" },
    ],
    name: "submitAnswerByArbitrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "answer_hash", type: "bytes32" },
      { internalType: "uint256", name: "max_previous", type: "uint256" },
      { internalType: "address", name: "_answerer", type: "address" },
    ],
    name: "submitAnswerCommitment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "answer", type: "bytes32" },
      { internalType: "uint256", name: "max_previous", type: "uint256" },
      { internalType: "address", name: "answerer", type: "address" },
    ],
    name: "submitAnswerFor",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "question_id", type: "bytes32" },
      { internalType: "bytes32", name: "answer", type: "bytes32" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "bond", type: "uint256" },
    ],
    name: "submitAnswerReveal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "template_hashes",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "templates",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export const QuoterABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_WETH9",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WETH9",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "quoteExactInput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint160",
        name: "sqrtPriceLimitX96",
        type: "uint160",
      },
    ],
    name: "quoteExactInputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "quoteExactOutput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint160",
        name: "sqrtPriceLimitX96",
        type: "uint160",
      },
    ],
    name: "quoteExactOutputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "amount0Delta",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "amount1Delta",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
] as const
