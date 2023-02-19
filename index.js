import {
	TransactionInstruction,
	VersionedTransaction,
	TransactionMessage,
	PublicKey,
	AddressLookupTableProgram,
	Connection,
	clusterApiUrl,
	Keypair,
	SystemProgram,
} from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { TOKEN_TYPES, LUNAR_TOKEN } from './tokens.js'

// connect to a cluster and get the current `slot`
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'processed')
const slot = await connection.getSlot('recent')

export function createKeypairFromFile(path) {
	return Keypair.fromSecretKey(Buffer.from(JSON.parse(readFileSync(path, 'utf-8'))))
}

export async function sendTransactionV0(connection, instructions, payer) {
	let blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash)

	const messageV0 = new TransactionMessage({
		payerKey: payer.publicKey,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const tx = new VersionedTransaction(messageV0)
	tx.sign([payer])
	const sx = await connection.sendTransaction(tx)

	console.log(`** -- Signature: ${sx}`)
}

const payer = createKeypairFromFile(homedir() + '/dogeswap-keypair/id.json')

console.log(payer.publicKey.toBase58())

const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
	authority: payer.publicKey,
	payer: payer.publicKey,
	recentSlot: slot,
})

// console.log('lookup table address:', lookupTableAddress.toBase58())

let addresses = [
	// elixir
	'Sysvar1nstructions1111111111111111111111111',
	'E1XRkj9fPF2NQUdoq41AHPqwMDHykYfn5PzBXAyDs7Be',
	'ComputeBudget111111111111111111111111111111',
	'AzAadD76oXaMk1b6fdGk6poVSEj1zpirgvk7gaBVqo3L',
	'GbAkQxNqU4pBQbciqPssb9fJ41W4sw8gEydLbfAUcoJ6',
	'BEgL1UXJgNT1oJx25usxW5wDDUaBM1N1UCCLZXfU1o3G',
	'9rAmFoAkcVYw4GBAdk3oobPDsM3ugfH8HETuPn9iEYsC',
	'A6bixUiWZVQvg4odnWkXfPxoyVhhqn1kGdc8fRU1brXN',
	'3zXeaxfj5sEQ1ywxtMutqTA7WaEkFbZa26r9bzTvsSvW',
	'49tfqB49v34F6oyQZhuBTwunPGpTPi6UdCP8CziTJxFH',
	// raydium
	'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
	'SysvarRent111111111111111111111111111111111',
	'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
	'So11111111111111111111111111111111111111112',
	'7fw8CPubr823mkEEXhTJeUP4vUNqGykEAWeGdc5Dgndg',
	'675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
	'5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
	'Gm8ewRpGBDmhTySsnWm4HTkmYrVK1kYoC4epzTevj7zi',
	'EGbbs9bDiYXe8sfuVJJvuNF6RCnJPQ1nKogzT2o5d8YK',
	'DY8Dm3ohP746eCiqRdH6A3YbdeVjPK85FWnXdTmk9R94',
	'DA2ZqAx6MP98wjv2uZeEbjy7x33bgHEGUf5sNX8S9Nxa',
	'6FNErGf7MjHj7J8vuxW7ZDaUFoBE48P1ESGPuoJTMGUv',
	'5Zd9LtjRi3HbaXm79rdsutarGcTgXVxpXsEAk2Jqgiox',
	'5Ncy2sYMLpHzgaCDy5ocWVCJCVeCZPxgRs7XYKMWt7kn',
	'5fRVecCXZfUFDrXjrH8HaCoKtcE7BYXip6dgNciaDEyJ',
	'3yG24ZrTmPnf7m4ZZhQuG9QXufy5LtjsAWs3fsSBqdYL',
	'3Y4xMRBdJzgnnQGK2SdzNxY5dxbbiJX2KZCRbEGoEa1g',
	'31LB8ZykVSqYpvGQiwXGHf75Rpmd3TbTprsyYJkeGUZm',
	'2QedB5jfRe3EeiEUFsRXCYDrYBFLPiTauQiEZAyp8nJp',

	'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
	'675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
	'11111111111111111111111111111111',
	'SysvarC1ock11111111111111111111111111111111',
	'SysvarRent111111111111111111111111111111111',
	'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
	'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
	'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
	'2qGyiNeWyZxNdkvWHc2jT5qkCnYa1j1gDLSSUmyoWMh8',
	'E1XRkj9fPF2NQUdoq41AHPqwMDHykYfn5PzBXAyDs7Be',
	'fee6uQpfQYhfZUxiYLvpAjuCGNE7NTJrCoXV8tsqsn6',
	'So11111111111111111111111111111111111111112',
	'6kLLewcYCvUK6xLQE1ep36ReamuTLFuTWwhCnbMCb3pd',

	'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
	'5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
	'9wTfFctuYVojD7MB2AQDUQmTA3pkZYev6GmZje9QfGQS',
	'BQXDYWZdtXqeLXFWYeRhLrGh8gcTmDQZQc92ENMaXSry',
	'Et3d3Jcxe2rZM5J5es9dEfSm1gKGeQoovfzcSRUeJicZ',
	'Bg2isp4C176o5615BLWjNvfModGCQFYyXtMP3zgPDCrR',
	'93L67quQSxUNtbYroxk46PYaoqyps4h3yw2BkwWRyU7F',
	'DMMBTBwEjwwaV5dSSPVYWKopatHg2MUh8R6mUqGWNydw',
	'413x5fBqSZyT4DyS9oauPvp1cbMVLhnzeHGe4fUmd8yV',
	'E5UaBddUS44BNyYiK12h5WQ5y9TrrwnQPD5uVrFSGixb',
	'25Cuzmbjgi3koqFaxn6QzRizLiYyNB7NtN1tdZShUA5q',
	'EVseAB3KCY8qmXiUQH2rDdGbRZoAdCY1URUshrPWDcHh',
	'QsrLS5YGvF574XyhDNyS3g22NhSpqTwW6zmzfJjVMN8',
	'8SYnBCKGYM12ozjiXqYDbSTe4atQTk1y2sXMCpUt7NGn',
	'7YqhZ8W445LjpEymK2Ta2NvxJr1NRhxowotVybvZzFYe',
	'H4bCvPGnDNzuGjF3H7uuqUWK1skTpBRcPjkeeVn4UZ2b',
	'AB3EayWSFZAU5jCEw64spXYCjPnS7TH3LW8im62oSKNZ',
	'3mRTPVDoZzGzsbA9E1eU6va7wYELu5nQTD6aD5ar4AJb',
	'3UZ2wVm2PuJSUcEvL6vunAovfj1CDn3wNGiEvojgTLQw',
	'jLF923FvHFbzGhiNvtQVxuFrz7q6bMzqDhGF5Yb9w2q',
]

// let lookupTableAccount = await connection
// 	.getAddressLookupTable(new PublicKey('14SU2WQHMXzjZFtxUpt4hnonYz7DbywWnWuHc6h3fL8U'))
// 	.then((res) => res.value)

// addresses.concat(lookupTableAccount.state.addresses.map((acc) => acc.toBase58()))

// lookupTableAccount = await connection
// 	.getAddressLookupTable(new PublicKey('4oA28x6ZA1sNPvXLWLG7aNcoPoNj4a6F3QYPyTS2HvYE'))
// 	.then((res) => res.value)

// addresses.concat(lookupTableAccount.state.addresses.map((acc) => acc.toBase58()))

// lookupTableAccount = await connection
// 	.getAddressLookupTable(new PublicKey('9oNDFSLwMJKd4GcXMwDKkrt5bg5nqQzUJTRkn8F8zqfN'))
// 	.then((res) => res.value)

const extendInstruction = AddressLookupTableProgram.extendLookupTable({
	payer: payer.publicKey,
	authority: payer.publicKey,
	lookupTable: lookupTableAddress,
	addresses: addresses.map((acc) => new PublicKey(acc)),
})

await sendTransactionV0(connection, [lookupTableInst, extendInstruction], payer)

console.log('Table address from cluster:', lookupTableAccount.key.toBase58())

for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
	const address = lookupTableAccount.state.addresses[i]
	console.log(i, address.toBase58())
}
