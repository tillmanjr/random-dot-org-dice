const config = require('../../src/config/config')

describe('config', () => {
    test('has bounds configuration', () => {
        const configObj = config
        expect(configObj).toHaveProperty("bounds")

        const bounds = configObj.bounds
        expect(bounds).toHaveProperty("rangeMin")
        expect(bounds).toHaveProperty("rangeMax")
    })

    test('has queue configuration', () => {
        const configObj = config
        expect(configObj).toHaveProperty("queue")

        const queue = configObj.queue
        expect(queue).toHaveProperty("capacity")
        expect(queue).toHaveProperty("refillAt")
    })
    test('has randomOrg configuration', () => {
        const configObj = config
        expect(configObj).toHaveProperty("randomOrg")

        const randomOrg = configObj.randomOrg
        expect(randomOrg).toHaveProperty("host")
        expect(randomOrg).toHaveProperty("path")
    })
})