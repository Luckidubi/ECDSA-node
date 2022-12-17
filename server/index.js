const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  //9d6401bfa064ceff5d026e38eb0576c97043c3072f0124cf365b6133d2fb76e6
  "0x6f4f33b3ff80eb9fe66e09cccd63928c28a52e55": 100,
  //75dd779d213a25bb12dedae049066345418090650b5680606e3543cec5cd51db
  "0x76fd55c243b563766b05d7f220739efa9ba7acf4": 50,
  // d69c7e6a0925c52eb00988cd8856f8b1de6b8b990ab617c6de13c2e03710f4a9
  "0xe0db2aec2997b99d4ef871a1188a76f007569eae": 75,
};

const lastTxNounce = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {
    sender,
    recipient,
    amount,
    nounce,
    transactionHash,
    signature,
    recoveryBit,
  } = req.body;

  publicKey = secp
    .recoverPublicKey(
      hexToBytes(transactionHash),
      hexToBytes(signature),
      recoveryBit
    )
    .slice(-20);
    console.log("sender " + sender, "0x" + toHex(publicKey));

  if (sender !== "0x" + toHex(publicKey)) {
    res.status(409).send({ message: "Sender is not the signer" });
    return;
  }

  const lastNounce = lastTxNounce[sender] || 0;
  if (lastNounce >= nounce) {
    res
      .status(409)
      .send({ message: "Sender is trying to replay nounce:", nounce });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    lastTxNounce[sender] = nounce;
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 100;
  }
}
