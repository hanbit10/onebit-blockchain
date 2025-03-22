const port = process.argv[2]

const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

const Blockchain = require('./blockchain')
const bitcoin = new Blockchain();

const uuid = require('uuid/v1')
const nodeAddress = uuid().split('-').join('')

const rp = require('request-promise')

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

app.post('/register-and-broadcast-node', (req,res) => {
    const newNodeUrl = req.body.newNodeUrl
    const regNodesPromises = []

    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl)

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl},
            json: true
        }
        regNodesPromises.push(rp(requestOptions))
    })
    
    Promise.all(regNodesPromises).then(data => {
        console.log(...bitcoin.networkNodes, bitcoin.currentNodeUrl, newNodeUrl)
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json:true
        }

        
    }).then( data => {
        res.json({note: 'New Node registered with network successfully'})
    })

    return rp(bulkRegisterOptions)
})

//It register node to other nodes
app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode)
        bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully'});
})

app.post('/register-node-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes

    allNetworkNodes.forEach(networkNodeUrl => {
        const notCurrentNode = bitcoin.currentNodeUrl != networkNodeUrl
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1    
        if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl)
    })
    res.json({note: 'Bulk registration successful'})
})



app.listen(port, () => {
    console.log(`listening on port ${port}...`)
})