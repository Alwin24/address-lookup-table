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
// const lookupTableAddress = new PublicKey("8Zr8ymaWMztnt51bQ9YRrx8QBCuEx5FJwWjoe7F5x6g5")

console.log('lookup table address:', lookupTableAddress.toBase58())

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
]

const extendInstruction = AddressLookupTableProgram.extendLookupTable({
	payer: payer.publicKey,
	authority: payer.publicKey,
	lookupTable: lookupTableAddress,
	addresses: addresses.map((address) => new PublicKey(address)),
})

await sendTransactionV0(connection, [lookupTableInst, extendInstruction], payer)

// const lookupTableAccount = await connection
//     .getAddressLookupTable(new PublicKey("Bvbui5svPefbMvoH37ANbQKM2fdU6YbbDFeiHmY9cpRs"))
//     .then((res) => res.value);

// console.log("Table address from cluster:", lookupTableAccount.key.toBase58());

// for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
//     const address = lookupTableAccount.state.addresses[i];
//     console.log(i, address.toBase58());
// }
