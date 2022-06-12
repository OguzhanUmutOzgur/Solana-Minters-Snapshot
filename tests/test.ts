import { getConnection, isMintTransaction, readHashlistFile } from "../functions";
import * as web3 from '@solana/web3.js';

const assert = require('assert');

const connection = getConnection(web3.clusterApiUrl('mainnet-beta'));
const nfts = {
    'DeGod #8252': {
        minter: 'GQL27uxVV18bbfWMy9JGF49NsQzUekx4h47SGT1MbWLh',
        mint: '4u9jWCzgsrcTSDettr9RhemKaKNpEstTWbhzZjo18q2G',
        result: false
    },
    'Galactic Gecko #3682': {
        minter: '4o9X991uReJGhYGmxbe7mmzJGRJEsZAk9bowmfvtzNTH',
        mint: 'Biv4rqi25GNSb2en5sfQpQg9mz819xr6wHcHFHRQ11do',
        result: false
    }
};

async function testMints(){
    for (const nft in nfts) {
        const confirmedTxs = await connection.getConfirmedSignaturesForAddress2(
            new web3.PublicKey(nfts[nft]['mint'])
        );

        for (const confirmedTx of confirmedTxs) {
            const transaction = await connection.getTransaction(confirmedTx.signature);

            if (isMintTransaction(transaction)) {
                const minter = transaction.transaction.message.accountKeys[0];
                if (minter.toBase58() == nfts[nft]['minter']) {
                    nfts[nft]['result'] = true;
                }
            }
        }
    }
}

describe('Fetching information...', () => {
    console.log(`\tThis may take few minutes... Please be patient.`);

    before(async () => { // async
        await testMints();
    });

    for (const nft in nfts) {
        it(nft, () => {
            assert.equal(nfts[nft]['result'], true);
        });
    }
});