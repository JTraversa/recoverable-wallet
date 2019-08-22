import { Bytes32, Dependencies, Transaction, TransactionReceipt } from '@zoltu/recoverable-wallet-library'
import { unsignedBigintToUint8Array, uint8ArrayToUnsignedBigint, uint8ArrayToSignedBigint, signedBigintToUint8Array } from '@zoltu/bigint-helpers'
import { JsonRpc } from '@zoltu/ethereum-types'

export class DependenciesImpl implements Dependencies<bigint> {
	public constructor(private readonly rpc: JsonRpc) { }

	public readonly call = async (transaction: Transaction<bigint>): Promise<Uint8Array> => await this.rpc.offChainContractCall(transaction)
	public readonly submitTransaction = async (transaction: Transaction<bigint>): Promise<TransactionReceipt> => {
		const receipt = await this.rpc.onChainContractCall(transaction)
		return { success: receipt.status, events: receipt.logs }
	}

	public readonly isLargeInteger = (x: any): x is bigint => typeof x === 'bigint'
	public readonly encodeLargeUnsignedInteger = (x: bigint): Bytes32 => Bytes32.fromByteArray(unsignedBigintToUint8Array(x, 256))
	public readonly encodeLargeSignedInteger = (x: bigint): Bytes32 => Bytes32.fromByteArray(signedBigintToUint8Array(x, 256))
	public readonly decodeLargeUnsignedInteger = (data: Bytes32): bigint => uint8ArrayToUnsignedBigint(data)
	public readonly decodeLargeSignedInteger = (data: Bytes32): bigint => uint8ArrayToSignedBigint(data)
}
