import { Msg } from '../../interfaces';

export function buildExecMsg(grantee: string, msgs: Msg[]) {
  return {
    typeUrl: '/cosmos.authz.v1beta1.MsgExec',
    value: {
      grantee,
      msgs,
    },
  };
}
