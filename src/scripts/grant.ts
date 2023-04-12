import { calculateFee, GasPrice } from '@cosmjs/stargate';
import { getSigningClient } from '../helpers/clients/get.signing.client';
import { fetchChainInfo } from '../helpers/fetchers/fetch.chain.info';
import { Logger } from '../helpers/logger';
import { buildGrantStakeMsg } from '../helpers/messages/build.grant.stake.msg';
import { buildGrantWithdrawValidatorCommissionMsg } from '../helpers/messages/build.grant.withdraw.validator.commission.msg';
import { getWallet } from '../helpers/wallet';

export async function grant(chain: string, granteeAddress: string, mnemonic: string, validatorAddress: string) {
  const logger = new Logger('Grant');

  try {
    logger.info('Running.');
    const { fee, prefix, rpcUrl, slip44 } = await fetchChainInfo(chain);
    const gasPrice = GasPrice.fromString(`${fee.low_gas_price}${fee.denom}`);

    const wallet = await getWallet(mnemonic, prefix, slip44);
    const [account] = await wallet.getAccounts();
    const signingClient = await getSigningClient(rpcUrl.address, gasPrice, wallet);

    const msgs = [
      buildGrantStakeMsg(granteeAddress, account.address, validatorAddress),
      buildGrantWithdrawValidatorCommissionMsg(granteeAddress, account.address),
    ];

    logger.info('Estimating gas...');
    const gas = await signingClient.simulate(account.address, msgs, undefined);
    logger.info('Approximate gas usage', gas);

    logger.info('Broadcasting...');
    const tx = await signingClient.signAndBroadcast(account.address, msgs, calculateFee(gas * 2, gasPrice));
    logger.info('Tx broadcasted', tx.transactionHash);
  } catch (e) {
    logger.error(e);
    process.exit();
  }
}
