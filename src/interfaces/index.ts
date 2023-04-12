interface ChainApi {
  address: string;
  provider: string;
}

interface ChainApis {
  grpc: ChainApi[];
  rest: ChainApi[];
  rpc: ChainApi[];
}

interface ChainFeeToken {
  denom: string;
  low_gas_price: number;
  average_gas_price: number;
  high_gas_price: number;
}

interface ChainFees {
  fee_tokens: ChainFeeToken[];
}

interface ChainStakingToken {
  denom: string;
}

interface ChainStaking {
  staking_tokens: ChainStakingToken[];
}

export interface ChainInfo {
  apis: ChainApis;
  fees: ChainFees;
  staking: ChainStaking;

  chain_name: string;
  network_type: string;
  pretty_name: string;
  chain_id: string;
  bech32_prefix: string;
  slip44: number;
}

export interface Msg {
  typeUrl: string;
  value: Uint8Array;
}
