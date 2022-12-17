import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";


export function hashTransaction(transaction) {
  return hashMessage(JSON.stringify(transaction));
}

export function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

export async function signTransaction(transactionHash, privateKey) {
  return secp.sign(transactionHash, privateKey, { recovered: true });
}
