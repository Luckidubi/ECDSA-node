const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils")
const getAddress = require("./getAddress")
const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey)

const address = getAddress(publicKey)
console.log('Private Key: ', toHex(privateKey));
console.log('Public Key: ', "0x" + toHex(publicKey.slice(-20)));
