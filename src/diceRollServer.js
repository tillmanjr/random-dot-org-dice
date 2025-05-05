const express = require('express')
const config = require('./config/config')
const SimpleHistory = require('./common/SimpleHistory')
const DiceRoller = require('./diceRoller/DiceRoller')

const app = express()

const PORT = config.server.port
let services

app.get('/', (req, res) => {
    res.send('Rollin\', rollin\', get your dice a\' rollin\'!')
})

app.get('/roll/:faceCount', async (req, res) => {
    const faceCount = req.params.faceCount
    const result = await services.diceRoller.roll(parseInt(faceCount))
    console.log('roll result', result)
    res.send(result)
})

app.get('/history/rolls/', async (req, res) => {
    const count = req.query.count
        ? parseInt(req.query.count)
        : -1
    const offset = req.query.offset
        ? parseInt(req.query.offset)
        : -1
    const result = await services.diceRoller.getRollHistory(count, offset)
    res.send(result)
})

app.get('/history/fetchRandoms/', (req, res) => {
    const count = req.query.count
        ? parseInt(req.query.count)
        : -1
    const offset = req.query.offset
        ? parseInt(req.query.offset)
        : -1
    const result = services.diceRoller.getFetchRandomsHistory(count, offset)
    res.send(result)
})


const initServices = async () => {
    const rollHistory = new SimpleHistory()
    const fetchHistory = new SimpleHistory()
    const diceRoller = new DiceRoller(config, rollHistory, fetchHistory)
    await diceRoller.init()
    services = {
        diceRoller
    }
}


function startServer() {
    app.listen(PORT, () => {
        console.log(`Dice Roll listening on port ${PORT}`)
    })
    console.log('Dice roller initializing services')
    initServices().then(_ => {
        console.log('Dice roller service ready')
    })
}

module.exports = {startServer}