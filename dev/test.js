const Blockchain = require('./blockchain')
const bitcoin = new Blockchain()
// bitcoin.createNewBlock(2334, 'ADFAFSDFSADSGGSADA', 'afdliuklaidfhasdlkfh')
// bitcoin.createTransaction(100, 'HANBITOASDFASDFIBH', 'DAVINAAGAHYHADFASDJFDSA')
// bitcoin.createNewBlock(123124, 'ADSFBHASDHFASDF', 'asdfadsfwetgsagas')
// bitcoin.createTransaction(5, 'HANBITOASDFASDFIBH', 'DAVINAAGAHYHADFASDJFDSA')
// bitcoin.createTransaction(200, 'HANBITOASDFASDFIBH', 'DAVINAAGAHYHADFASDJFDSA')
// bitcoin.createTransaction(500, 'HANBITOASDFASDFIBH', 'DAVINAAGAHYHADFASDJFDSA')
// bitcoin.createNewBlock(12313, 'SAVEPENDINGTRANS', 'ASDFASDFSADFDSAFA')

const previousBlockHash = '0AA6875C9F0D6B5DFBD1C38EB8207AFDBBB8C192F04511C95648CDF96E5A97C8'
const currentBlockData = [{
    amount: 10,
    sender: 'HANBITCHANG',
    recipient: 'DAVINAPFAFF',
}]
const nonce = 100
bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));