import { Slip10RawIndex } from '@cosmjs/crypto';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import {
  calculateFee,
  coin,
  GasPrice,
  SigningStargateClient,
  QueryClient,
  setupDistributionExtension,
} from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import axios from 'axios';
import { MsgWithdrawValidatorCommission } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx.js';
import { ChainInfo, Message } from './helpers/interfaces';
import { Logger } from './helpers/logger';

export class App {
  private chain: string;
  private mnemonic: string;

  constructor(chain?: string, mnemonic?: string) {
    const logger = new Logger('App');

    if (!chain) {
      logger.warn('Please provide a CHAIN environment variable');
      process.exit();
    }

    if (!mnemonic) {
      logger.warn('Please provide a MNEMONIC environment variable');
      process.exit();
    }

    this.chain = chain;
    this.mnemonic = mnemonic;
  }

  private async fetchChainInfo(): Promise<ChainInfo> {
    const response = await axios.get(`https://chains.cosmos.directory/${this.chain}`);
    return response.data.chain;
  }

  private buildDelegateMessage(address: string, validatorAddress: string, amount: string, denom: string) {
    return {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: MsgDelegate.encode(
        MsgDelegate.fromPartial({
          delegatorAddress: address,
          validatorAddress: validatorAddress,
          amount: coin(amount, denom),
        }),
      ).finish(),
    };
  }

  private buildExecMessage(grantee: string, messages: Message[]) {
    return {
      typeUrl: '/cosmos.authz.v1beta1.MsgExec',
      value: {
        grantee,
        msgs: messages,
      },
    };
  }

  private buildWithdrawValidatorCommissionMessage(validatorAddress: string) {
    return {
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      value: MsgWithdrawValidatorCommission.encode(
        MsgWithdrawValidatorCommission.fromPartial({
          validatorAddress,
        }),
      ).finish(),
    };
  }

  async compound(delegatorAddress?: string, validatorAddress?: string) {
    const logger = new Logger('Compound');

    if (!delegatorAddress) {
      logger.warn('Please provide a DELEGATOR_ADDRESS environment variable');
      process.exit();
    }

    if (!validatorAddress) {
      logger.warn('Please provide a VALIDATOR_ADDRESS environment variable');
      process.exit();
    }

    try {
      logger.info('Running.');
      const info = await this.fetchChainInfo();

      const { bech32_prefix: prefix, slip44 } = info;
      const fee = info.fees.fee_tokens.at(0);
      const staking = info.staking.staking_tokens.at(0);
      const rpcUrl = info.apis.rpc.at(0);

      if (!fee) {
        throw new Error('Fee data not obtained!');
      }

      if (!staking) {
        throw new Error('Staking data not obtained!');
      }

      if (!rpcUrl) {
        throw new Error('RPC url not obtained!');
      }

      const hdPath = [
        Slip10RawIndex.hardened(44),
        Slip10RawIndex.hardened(slip44),
        Slip10RawIndex.hardened(0),
        Slip10RawIndex.normal(0),
        Slip10RawIndex.normal(0),
      ];

      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this.mnemonic, {
        prefix,
        hdPaths: [hdPath],
      });

      const [account] = await wallet.getAccounts();
      const gasPrice = GasPrice.fromString(`${fee.low_gas_price}${fee.denom}`);

      const signingClient = await SigningStargateClient.connectWithSigner(rpcUrl.address, wallet, {
        gasPrice,
      });

      const tmClient = await Tendermint34Client.connect(rpcUrl.address);
      const queryClient = QueryClient.withExtensions(tmClient, setupDistributionExtension);

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

      const execMsg = this.buildExecMessage(account.address, [
        this.buildWithdrawValidatorCommissionMessage(validatorAddress),
        this.buildDelegateMessage(delegatorAddress, validatorAddress, amount.toString(), staking.denom),
      ]);

      logger.info('Estimating gas...');
      const gas = await signingClient.simulate(account.address, [execMsg], undefined);
      logger.info('Approximate gas usage', gas);

      logger.info('Broadcasting...');
      const tx = await signingClient.signAndBroadcast(account.address, [execMsg], calculateFee(gas * 2, gasPrice));

      logger.info('Tx broadcasted', tx.transactionHash);
    } catch (e) {
      logger.error(`Something went wrong: ${e}`);
      process.exit();
    }
  }
}
