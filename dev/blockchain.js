class Blockchain {
    constructor () {
        this.chain = []
        this.pendingTransactions = []

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

        Blockchain.prototype.hashBlock = (blockdata) => {
            
        }
    }




}

module.exports = Blockchain