import axios from 'axios';
import { ChainInfo } from '../../interfaces';

export async function fetchChainInfo(chain: string) {
  const response = await axios.get<{ chain: ChainInfo }>(`https://chains.cosmos.directory/${chain}`);
  const { chain: info } = response.data;
  const { bech32_prefix: prefix, slip44 } = info;
  const fee = info.fees.fee_tokens.at(0);
  const staking = info.staking.staking_tokens.at(0);
  const rpcUrl = info.apis.rpc.at(0);

  if (!fee) {
    throw new Error('Fee data not obtained!');
  }

  if (!staking) {
    throw new Error('Staking data not obtained!');
  }

  if (!rpcUrl) {
    throw new Error('RPC url not obtained!');
  }

  return {
    fee,
    prefix,
    rpcUrl,
    slip44,
    staking,
  };
}
