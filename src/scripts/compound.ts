import { calculateFee, GasPrice } from '@cosmjs/stargate';
import { getQueryClient } from '../helpers/clients/get.query.client';
import { getSigningClient } from '../helpers/clients/get.signing.client';
import { fetchChainInfo } from '../helpers/fetchers/fetch.chain.info';
import { Logger } from '../helpers/logger';
import { buildDelegateMsg } from '../helpers/messages/build.delegate.msg';
import { buildExecMsg } from '../helpers/messages/build.exec.msg';
import { buildWithdrawValidatorCommissionMsg } from '../helpers/messages/build.withdraw.validator.commission.msg';
import { getWallet } from '../helpers/wallet';

export async function compound(chain: string, delegatorAddress: string, mnemonic: string, validatorAddress: string) {
  const logger = new Logger('Compound');

  try {
    logger.info('Running.');
    const { fee, prefix, rpcUrl, slip44, staking } = await fetchChainInfo(chain);
    const gasPrice = GasPrice.fromString(`${fee.low_gas_price}${fee.denom}`);

    const wallet = await getWallet(mnemonic, prefix, slip44);
    const [account] = await wallet.getAccounts();

    const signingClient = await getSigningClient(rpcUrl.address, gasPrice, wallet);
    const queryClient = await getQueryClient(rpcUrl.address);

    const { commission } = await queryClient.distribution.validatorCommission(validatorAddress);
    const { rewards } = await queryClient.distribution.delegationRewards(delegatorAddress, validatorAddress);

    let amount = 0n;

    commission?.commission.forEach((value) => {
      if (value.denom === staking.denom) {
        const v = BigInt(value.amount) / BigInt(1e18);
        amount += v;
        logger.info('Collected', v.toString(), staking.denom, 'commission');
      }
    });

    rewards.forEach((value) => {
      if (value.denom === staking.denom) {
        const v = BigInt(value.amount) / BigInt(1e18);
        amount += v;
        logger.info('Collected', v.toString(), staking.denom, 'rewards');
      }
    });

    logger.info('Total collected', amount.toString(), staking.denom);

    const execMsg = buildExecMsg(account.address, [
      buildWithdrawValidatorCommissionMsg(validatorAddress),
      buildDelegateMsg(delegatorAddress, amount.toString(), staking.denom, validatorAddress),
    ]);

    logger.info('Estimating gas...');
    const gas = await signingClient.simulate(account.address, [execMsg], undefined);
    logger.info('Approximate gas usage', gas);

    logger.info('Broadcasting...');
    const tx = await signingClient.signAndBroadcast(account.address, [execMsg], calculateFee(gas * 2, gasPrice));
    logger.info('Tx broadcasted', tx.transactionHash);
  } catch (e) {
    logger.error(e);
    process.exit();
  }
}
