import { keccak256 } from "ethereum-cryptography/keccak";

function getAddress(publicKey) {
    const hash = keccak256(publicKey.slice(1)).slice(-20);



    return hash;
}

export default getAddress;