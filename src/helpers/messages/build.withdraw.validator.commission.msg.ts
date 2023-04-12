import { MsgWithdrawValidatorCommission } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

export function buildWithdrawValidatorCommissionMsg(validatorAddress: string) {
  return {
    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    value: MsgWithdrawValidatorCommission.encode(
      MsgWithdrawValidatorCommission.fromPartial({
        validatorAddress,
      }),
    ).finish(),
  };
}
