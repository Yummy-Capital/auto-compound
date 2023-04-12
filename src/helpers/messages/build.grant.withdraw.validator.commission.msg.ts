import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { buildGrantMsg } from './build.grant.msg';

export function buildGrantWithdrawValidatorCommissionMsg(grantee: string, granter: string) {
  const value = GenericAuthorization.encode(
    GenericAuthorization.fromPartial({
      msg: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    }),
  ).finish();

  return buildGrantMsg('/cosmos.authz.v1beta1.GenericAuthorization', value, grantee, granter);
}
