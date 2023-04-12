import * as dotenv from 'dotenv';
import { join } from 'path';
import { compound } from './scripts/compound';

dotenv.config({ path: join(__dirname, '../env/compound.env') });

const chain = process.env.CHAIN;
const delegatorAddress = process.env.DELEGATOR_ADDRESS;
const mnemonic = process.env.MNEMONIC;
const validatorAddress = process.env.VALIDATOR_ADDRESS;

if (!chain) {
  console.log('Please provide a CHAIN environment variable!');
  process.exit();
}

if (!delegatorAddress) {
  console.log('Please provide a DELEGATOR_ADDRESS environment variable!');
  process.exit();
}

if (!mnemonic) {
  console.log('Please provide a MNEMONIC environment variable!');
  process.exit();
}

if (!validatorAddress) {
  console.log('Please provide a VALIDATOR_ADDRESS environment variable!');
  process.exit();
}

compound(chain, delegatorAddress, mnemonic, validatorAddress);
