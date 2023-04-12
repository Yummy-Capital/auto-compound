import * as dotenv from 'dotenv';
import { join } from 'path';
import { grant } from './scripts/grant';

dotenv.config({ path: join(__dirname, '../env/grant.env') });

const chain = process.env.CHAIN;
const granteeAddress = process.env.GRANTEE_ADDRESS;
const mnemonic = process.env.MNEMONIC;
const validatorAddress = process.env.VALIDATOR_ADDRESS;

if (!chain) {
  console.log('Please provide a CHAIN environment variable!');
  process.exit();
}

if (!granteeAddress) {
  console.log('Please provide a GRANTEE_ADDRESS environment variable!');
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

grant(chain, granteeAddress, mnemonic, validatorAddress);
