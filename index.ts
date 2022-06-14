import * as web3 from '@solana/web3.js';
import candyMachineProgramIDs from './constants';
import { program } from 'commander';
import { getConnection, isMintTransaction, readHashlistFile, saveAirdropPlan, saveMinterSnapshot, sleep } from './functions';

/**Parse CLI options**/
program
    .option('-pid, --program-id <string>')
    .option('-u, --rpc-url <string>')
    .option('-drop, --drop-amount <number>')
    .option('-delay, --request-delay <number>', 'in milliseconds (100 = 0.1 seconds)');

program.parse();
const options = program.opts();
if (options.programId) { candyMachineProgramIDs.push(options.programId); };

const rpcURL: string = options.rpcUrl || web3.clusterApiUrl('mainnet-beta');
const airdropAmount: number | undefined = parseFloat(options.dropAmount) || undefined;
const rpcCallDelay: number = options.requestDelay || 100;
/***********************/

const minters: Array<{ mint: string, minter: string, txId: string }> = [];
const hashlist = readHashlistFile();

(async () => {
    const connection = getConnection(rpcURL);

    for (const hash of hashlist) {
        const confirmedTxs = await connection.getConfirmedSignaturesForAddress2(
            new web3.PublicKey(hash)
        );
        sleep(rpcCallDelay)//Avoid over heating the RPC.

        //Sort by blockTime because mint transaction is most likely to be the very first or second transaction
        confirmedTxs.sort((txA, txB) => {
            return (txA.blockTime && txB.blockTime) ? 
                (txA.blockTime > txB.blockTime ? 1 : -1): 
                0;
        });


        for (const confirmedTx of confirmedTxs) {
            const transaction = await connection.getTransaction(confirmedTx.signature);
            var isTxFound = false;
            sleep(rpcCallDelay)//Avoid over heating the RPC.

            if (isMintTransaction(transaction)) {
                const minter = transaction.transaction.message.accountKeys[0];
                isTxFound = true;
                minters.push({
                    mint: hash,
                    minter: minter.toBase58(),
                    txId: confirmedTx.signature
                });
                break;
            }
        }
        isTxFound ? 
            console.log(`\tFetched information for ${hash}`) : 
            console.log(`\tCouldn't find the mint transaction. Please check Program Id option in README`);
    }

})().finally(() => {
    saveMinterSnapshot(minters) ?
        console.log('\n\tSnapshot saved successfully') :
        console.log('\n\tThere has been an error while trying to save snapshot');

    if(airdropAmount !== undefined){
        saveAirdropPlan(minters, airdropAmount) ?
            console.log('\tAirdrop plan saved successfully') :
            console.log('\tThere has been an error while trying to save airdrop plan');
    }
});
