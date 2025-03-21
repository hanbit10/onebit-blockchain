const sha256 = require('sha256')
const currentNodeUrl = process.argv[3]

class Blockchain {
    constructor () {
        this.chain = []
        this.pendingTransactions = [];
        this.currentNodeUrl = currentNodeUrl
        this.networkNodes = [];

        Blockchain.prototype.createNewBlock = (nonce, previousBlockHash, hash) => {
            const newBlock = {
                index: this.chain.length + 1,
                timestamp: Date.now(),
                transactions: this.pendingTransactions,
                nonce: nonce,
                hash: hash,
                previousBlockHash: previousBlockHash,
            }
            this.pendingTransactions = [];
            this.chain.push(newBlock);
            return newBlock
        }

        this.createNewBlock(100, '0', '0')

        Blockchain.prototype.getLastBlock = () => {
            return this.chain[this.chain.length -1]
        }

        Blockchain.prototype.createTransaction = (amount, sender, recipient) => {
            const newTransaction = {
                amount: amount,
                sender: sender,
                recipient: recipient
            }

            this.pendingTransactions.push(newTransaction)
            return this.getLastBlock()['index'] + 1;
        }

        Blockchain.prototype.hashBlock = (previousBlockHash, currentBlockData, nonce) => {
            const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
            const hash = sha256(dataAsString)
            return hash
        }

        //proofOfWork keep searching for number 0000 on left side of the hash for the previousBlockHash, currentBlockData and nonce
        Blockchain.prototype.proofOfWork = (previousBlockHash, currentBlockData) => {
            let nonce = 0;
            let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
            while(hash.substring(0, 4) !== '0000'){
                nonce++
                hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
            }
            return nonce
        }
    }
}

module.exports = Blockchain