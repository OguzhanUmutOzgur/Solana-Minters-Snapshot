import * as web3 from '@solana/web3.js';
import fs = require('fs');
import candyMachineProgramIDs from './constants';

export function getConnection(rpc_url:string){
    return new web3.Connection(
        rpc_url,
        'confirmed'
    );
}

export function saveMinterSnapshot(minters: Array<{
    mint: string;
    minter: string;
    txId: string;
}>): boolean{
    try{
        fs.writeFileSync(
            'minters_snapshot.json',
            JSON.stringify(minters)
        );
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

export function isMintTransaction(transaction: web3.TransactionResponse): boolean {

    const interactedProgramIds = transaction.transaction.message.programIds().map((programId) => {
        return programId.toBase58();
    });

    return candyMachineProgramIDs.some((candyMachineProgramID) => {
        return interactedProgramIds.includes(candyMachineProgramID);
    });
}

export function readHashlistFile(): Array<string>{
    const path = './hashlist/hashlist.json';
    if(!fs.existsSync(path)){
        console.log('hashlist.json not found\n\n\tCopy list of mint addresses in hashlist folder as "hashlist.json" in form of JSON Array');
        process.exit(1);
    }

    const jsonString = fs.readFileSync('./hashlist/hashlist.json', "utf-8");
    const hashlist: Array<string> = JSON.parse(jsonString);

    return hashlist;
}