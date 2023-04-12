import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice, SigningStargateClient } from '@cosmjs/stargate';

export function getSigningClient(address: string, gasPrice: GasPrice, wallet: DirectSecp256k1HdWallet) {
  return SigningStargateClient.connectWithSigner(address, wallet, {
    gasPrice,
  });
}
