
# Solana token minters snapshot
This script allows users to snapshot the initial minter of a list of given tokens. It could be useful for NFT collections who need to take a snapshot of initial minters.

Make sure to read options section above. I highly recommend using a CUSTOM RPC and pay attention to PROGRAM ID.

## Requirements

 - [Node.js](https://nodejs.org/en/)
 - [ts-node](https://www.npmjs.com/package/ts-node)


## Installation

```
npm install
```

## Usage
- Copy and paste the list of tokens in **`hashlist/hashlist.json`** in form of [JSON Array](https://www.javatpoint.com/json-array) or directly replace with your JSON file (with same name).

- Use `ts-node index.ts` in terminal.

### Example usage 
```
ts-node index.ts --program-id DVWiM21gcNvyNq7G3UUUwsxWQzK3FbCoimUum9xTaj6 --rpc-url https://solana-api.projectserum.com --drop-amount 0.45 --request-delay 250
```

## Options
You can use all of above options together. Make sure to read carefully.
### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Program Id
Depending on where you minted your tokens, you may need to pass the program id. The script currently can take into account popular programs such as **`Candy Machine V2`**. You can see defined program ids in **`./constants.ts`**.

You can check the program id of your NFTs in any transaction explorer ([SolScan](https://solscan.io/), [Solana Explorer](https://explorer.solana.com/))

[Example program id from SolScan](https://prnt.sc/aJ05ywFeXRUG)

```
ts-node index.ts --program-id <program id>
```

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RPC URL
Minter snapshot is an heavy task and makes requests to Solana RPCs. I highly recommend using a **CUSTOM RPC**.

```
ts-node index.ts --rpc-ul <rpc url>
```

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Delay
You can set the delay between each RPC calls to avoid getting time-outed. I would suggest at least 250ms if you are using a public one.

```
ts-node index.ts --request-delay <milliseconds>
```

### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Airdrop plan
If you are taking this snapshot make an airdrop. 

You can use drop option which takes an amount as parameter and creates a JSON file with unique addresses and summed up amounts.

```
ts-node index.ts --drop-amount <amount>
```

## Test
You can test 2 NFTs (DeGod #8252 and Galactic Gecko #3682) in before hand to see if script works correctly. 

```
npm run test
```
