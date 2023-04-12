import { StakeAuthorization } from 'cosmjs-types/cosmos/staking/v1beta1/authz';
import { buildGrantMsg } from './build.grant.msg';

export function buildGrantStakeMsg(grantee: string, granter: string, validatorAddress: string) {
  const value = StakeAuthorization.encode(
    StakeAuthorization.fromPartial({
      allowList: { address: [validatorAddress] },
      authorizationType: 1,
    }),
  ).finish();

  return buildGrantMsg('/cosmos.staking.v1beta1.StakeAuthorization', value, grantee, granter);
}
