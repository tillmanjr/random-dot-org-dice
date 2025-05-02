const diceConsts = require('../../src/common/consts')
const  {
    supportedDiceFaces
} = diceConsts


describe('dice consts', () => {
    describe('supportedDiceFaces', () => {
        test('has one property per face', () => {
            expect(supportedDiceFaces).toHaveProperty('d3', 3)
            expect(supportedDiceFaces).toHaveProperty('d4', 4)
            expect(supportedDiceFaces).toHaveProperty('d6', 6)
            expect(supportedDiceFaces).toHaveProperty('d8', 8)
            expect(supportedDiceFaces).toHaveProperty('d10', 10)
            expect(supportedDiceFaces).toHaveProperty('d12', 12)
            expect(supportedDiceFaces).toHaveProperty('d16', 16)
            expect(supportedDiceFaces).toHaveProperty('d20', 20)
            expect(supportedDiceFaces).toHaveProperty('d50', 50)
            expect(supportedDiceFaces).toHaveProperty('d100', 100)
        })
    })
})