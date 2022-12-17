import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import {toHex} from "ethereum-cryptography/utils"
import getaddress from "./scripts/getAddress"
function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, nounce }) {
  async function onChange(evt) {
    const privateKey= evt.target.value;

    setPrivateKey(privateKey);
    // const address = toHex(secp.getPublicKey(privateKey));
    const address = "0x" + toHex(secp.getPublicKey(privateKey).slice(1).slice(-20))
    console.log(address)

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
       Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Address: {address}
      </label>

      <label>
        Nounce: {nounce}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
