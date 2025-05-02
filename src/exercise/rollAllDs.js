const DiceRoller = require('../diceRoller/DiceRoller')
const {D6x500} = require('./D6x500')
const {D8x500} = require('./D8x500')
const {D20x500} = require('./D20x500')
const {D100x500} = require('./D100x500')

/*
    Recommend piping stdout to a file, rolls.txt or similar
        $ node ./src/exercise//rollAllDs.js > rolls.txt
    
    Windows - if using git-bash terminal from Windows fork to bash before running:
        $ "C:\Program Files\Git\bin\bash.exe"

*/


const rollAll = async ()  => {
    const config = {
        bounds: {
            rangeMin: 1,
            rangeMax: 1200 // Least common denominator of 3,4,6,8,10,12,16,20,50,100
        },
        queue: {
            capacity: 1000,
            refillAt: 20
        },
        randomOrg: {
            host: 'https://www.random.org',
            path: 'integers'
        }
    }
    const roller = new DiceRoller(config)
    await roller.init()

    let result = []

    const r1 = await D6x500(roller)
    const r2 = await D8x500(roller)
    const r3 = await D20x500(roller)
    const r4 = await D100x500(roller)

    const r5 = await D8x500(roller)
    const r6 = await D100x500(roller)
    const r7 = await D6x500(roller)
    const r8 = await D20x500(roller)

    result = r1.concat(
        r2,
        r3,
        r4,
        r5,
        r6,
        r7,
        r8
    )

    return result
}


rollAll()
    .then( (values => {
        values.forEach(value => console.log(value))
    }))