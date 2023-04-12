import { coin } from '@cosmjs/stargate';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export function buildDelegateMsg(address: string, amount: string, denom: string, validatorAddress: string) {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgDelegate.encode(
      MsgDelegate.fromPartial({
        amount: coin(amount, denom),
        delegatorAddress: address,
        validatorAddress: validatorAddress,
      }),
    ).finish(),
  };
}
