
const nacl = require('tweetnacl');
const Account =  require('@solana/web3.js').Account;
const fs = require("fs")
const derivePath =  require('ed25519-hd-key').derivePath;
const config = require ('./config.json');

let path = `m/44'/501'/0'/0'`;
async function makeAddress(){
  const bip39 = await require('bip39');
  let bits = 128;
  if (config.words_num === 24) {
    bits = 256
  }

  const mnemonic = bip39.generateMnemonic(bits);
  const seed_t = await bip39.mnemonicToSeed(mnemonic);

  const seed = Buffer.from(seed_t).toString('hex')
  // console.log(mnemonic);
  // console.log(seed);
  
  const derivedSeed = derivePath(path, seed).key;
  const account = new Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
  
  // console.log(account.publicKey.toBase58());
  return {
    pub: account.publicKey.toBase58(),
    keys: mnemonic
  }
}

//正则匹配，默认匹配前三个字符相同
const ValidKeys = /^([A-Z a-z 0-9])\1{2,}/
//const ValidKeys = new RegExp(config.regx);
//const lucky_words = '888';
async function task() {
  while(true) {
    const { pub, keys } = await makeAddress()
    //if (pub.startsWith()) {
    if (ValidKeys.test(pub)) {
      fs.appendFileSync(config.save_file, JSON.stringify({pub,keys}) +'\n')
    }
  }
}
task()
