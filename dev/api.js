var express = require('express')
var app = express()

app.get('/blockchain', (req, res) => {
})

app.get('/transaction', (req, res) => {
})

app.get('/mine', (req, res) => {
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})