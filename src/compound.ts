import * as dotenv from 'dotenv';
import { App } from './app';

dotenv.config();

const app = new App(process.env.CHAIN, process.env.MNEMONIC);
app.compound(process.env.DELEGATOR_ADDRESS, process.env.VALIDATOR_ADDRESS);
