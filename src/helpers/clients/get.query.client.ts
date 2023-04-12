import { setupDistributionExtension, QueryClient } from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

export async function getQueryClient(address: string) {
  const tmClient = await Tendermint34Client.connect(address);
  return QueryClient.withExtensions(tmClient, setupDistributionExtension);
}
