import { Slip10RawIndex } from '@cosmjs/crypto';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

export function getWallet(mnemonic: string, prefix: string, slip44: number) {
  const hdPath = [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(slip44),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(0),
  ];

  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix,
    hdPaths: [hdPath],
  });
}
