const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.Hash();
  }

  Hash() {
    return SHA256(this.index +this.timestamp +JSON.stringify(this.data) +this.previousHash +this.nonce).toString();
  }

  mining(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.Hash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.FirstBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  FirstBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  LastBlock() {
    return this.chain[this.chain.length - 1];
  }

  Reward(miningRewardAddress) {
    const rewardTransaction = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(rewardTransaction);

    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      this.pendingTransactions,
      this.LastBlock().hash
    );

    newBlock.mining(this.difficulty);

    this.chain.push(newBlock);

    this.pendingTransactions = [];
  }

  Transactions(transaction) {
    this.pendingTransactions.push(transaction);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.Hash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}


