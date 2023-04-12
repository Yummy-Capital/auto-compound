// import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';

export function buildGrantMsg(authType: string, authValue: Uint8Array, grantee: string, granter: string) {
  // TODO: INVESTIGATION REQUIRED
  // MsgGrant.encode() cause error:
  // Error: Query failed with (6): rpc error: code = Unknown desc = invalid granter address: empty address string is not allowed: invalid address [cosmossdk.io/errors@v1.0.0-beta.7/errors.go:153]

  // MsgGrant.encode(
  //   MsgGrant.fromPartial({
  //     grant: {
  //       authorization: {
  //         typeUrl: authType,
  //         value: authValue,
  //       },
  //     },
  //     grantee,
  //     granter,
  //   }),
  // ).finish();

  return {
    typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
    value: {
      grant: {
        authorization: {
          typeUrl: authType,
          value: authValue,
        },
      },
      grantee,
      granter,
    },
  };
}
