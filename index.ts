import * as web3 from '@solana/web3.js';
import candyMachineProgramIDs from './constants';
import { program } from 'commander';
import { getConnection, isMintTransaction, readHashlistFile, saveMinterSnapshot } from './functions';

/**Parse CLI options**/
program
    .option('-pid, --program-id <string>')
    .option('-u, --rpc-url <string>');

program.parse();
const options = program.opts();
if (options.programId) { candyMachineProgramIDs.push(options.programId); };

const rpc_url = options.rpcUrl || web3.clusterApiUrl('mainnet-beta');
/***********************/

const minters: Array<{ mint: string, minter: string, txId: string }> = [];
const hashlist = readHashlistFile();

(async () => {
    const connection = getConnection(rpc_url);

    for (const hash of hashlist) {
        const confirmedTxs = await connection.getConfirmedSignaturesForAddress2(new web3.PublicKey(hash));

        for (const confirmedTx of confirmedTxs) {
            const transaction = await connection.getTransaction(confirmedTx.signature);

            if (isMintTransaction(transaction)) {

                const minter = transaction.transaction.message.accountKeys[0];
                minters.push({
                    mint: hash,
                    minter: minter.toBase58(),
                    txId: confirmedTx.signature
                });
            }
        }
    }

})().finally(() => {
    saveMinterSnapshot(minters) ?
        console.log('Snapshot saved successfully') :
        console.log('There has been an error while trying to save snapshot');
});