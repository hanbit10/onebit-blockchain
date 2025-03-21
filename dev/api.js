const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

const Blockchain = require('./blockchain')
const bitcoin = new Blockchain();

const uuid = require('uuid/v1')
const nodeAddress = uuid().split('-').join('')

app.get('/blockchain', (req, res) => {
    res.send(bitcoin)
    // console.log('blockchain', bitcoin)
})

app.post('/transaction', (req, res) => {
    const blockIndex = bitcoin.createTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `Transaction will be added in block ${blockIndex}`})
})

app.get('/mine', (req, res) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash']
    bitcoin.createTransaction(12.5, "00", nodeAddress)
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index']+1
    }

    // console.log('currentBlockData',currentBlockData)

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)


    // console.log('newBlock', newBlock)
    
    res.json({
        note: "New block mined successfully",
        block: newBlock
    })

})



app.listen(3000, () => {
    console.log('listening on port 3000')
})