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
const slot = await connection.getSlot('processed')

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

// let addresses = [
//     payer.publicKey,
//     SystemProgram.programId,
//     TOKEN_PROGRAM_ID,
//     statsAccount
// ]

const extendInstruction = AddressLookupTableProgram.extendLookupTable({
	payer: payer.publicKey,
	authority: payer.publicKey,
	lookupTable: lookupTableAddress,
	addresses,
})

await sendTransactionV0(connection, [extendInstruction], payer)

// const lookupTableAccount = await connection
//     .getAddressLookupTable(new PublicKey("Bvbui5svPefbMvoH37ANbQKM2fdU6YbbDFeiHmY9cpRs"))
//     .then((res) => res.value);

// console.log("Table address from cluster:", lookupTableAccount.key.toBase58());

// for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
//     const address = lookupTableAccount.state.addresses[i];
//     console.log(i, address.toBase58());
// }
