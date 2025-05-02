const diceUtils = require('../../src/common/utils')
const {invalidRandomValue} = require('../../src/common/consts')
const {
    convertRandomToDieValue,
    isNumber,
    isNotNumber,
    isSupportedFaceCount
} = diceUtils.test

describe('dice utils', () => {
    describe('isNumber', () => {
        test('string should fail', () => {expect(isNumber('foo')).not.toBeTruthy()})
        test('float should succeed', () => {expect(isNumber(3.1415)).toBeTruthy()})
        test('integer should succeed', () => {expect(isNumber(31415)).toBeTruthy()})
        test('NaN should succeed', () => {expect(isNumber(NaN)).toBeTruthy()})
    })

    describe('isNotNumber', () => {
        test('string should succeed', () => {expect(isNotNumber('foo')).toBeTruthy()})
        test('float should fail', () => {expect(isNotNumber(3.1415)).not.toBeTruthy()})
        test('integer should fail', () => {expect(isNotNumber(31415)).not.toBeTruthy()})
        test('NaN should fail', () => {expect(isNotNumber(NaN)).not.toBeTruthy()})
    })

    describe('isSupportedFaceCount', () => {
        test('3 should succeed', () => {expect(isSupportedFaceCount(3)).toBeTruthy()})
        test('4 should succeed', () => {expect(isSupportedFaceCount(4)).toBeTruthy()})
        test('6 should succeed', () => {expect(isSupportedFaceCount(6)).toBeTruthy()})
        test('8 should succeed', () => {expect(isSupportedFaceCount(8)).toBeTruthy()})
        test('10 should succeed', () => {expect(isSupportedFaceCount(10)).toBeTruthy()})
        test('12 should succeed', () => {expect(isSupportedFaceCount(12)).toBeTruthy()})
        test('16 should succeed', () => {expect(isSupportedFaceCount(16)).toBeTruthy()})
        test('20 should succeed', () => {expect(isSupportedFaceCount(20)).toBeTruthy()})
        test('50 should succeed', () => {expect(isSupportedFaceCount(50)).toBeTruthy()})
        test('100 should succeed', () => {expect(isSupportedFaceCount(100)).toBeTruthy()})

        test('0 should not succeed', () => {expect(isSupportedFaceCount(0)).not.toBeTruthy()})
        test('-1 (consts.invalidRandomValue) should not succeed', () => {expect(isSupportedFaceCount(invalidRandomValue)).not.toBeTruthy()})
        test('5 should not succeed', () => {expect(isSupportedFaceCount(5)).not.toBeTruthy()})
        
    })

    describe('convertRandomToDieValue', () => {
        test('invalid die value should throw', () => expect(() => convertRandomToDieValue(1, 33)).toThrow())
        test('die value of string should throw', () => expect(() => convertRandomToDieValue(1, '3')).toThrow())
        test('random value of string should throw', () => expect(() => convertRandomToDieValue('1', 3)).toThrow())
        describe('d3', (() => {
            test('random value of 1 results in 1', () => {
                expect(convertRandomToDieValue(1, 3)).toEqual(1)
            })
            test('random value of 2 results in 2', () => {
                expect(convertRandomToDieValue(2, 3)).toEqual(2)
            })
            test('random value of 3 results in 3', () => {
                expect(convertRandomToDieValue(3, 3)).toEqual(3)
            })
            test('random value of 300 results in 3', () => {
                expect(convertRandomToDieValue(300, 3)).toEqual(3)
            })
            test('random value of 301 results in 1', () => {
                expect(convertRandomToDieValue(301, 3)).toEqual(1)
            })
            test('random value of 1200 results in 3', () => {
                expect(convertRandomToDieValue(1200, 3)).toEqual(3)
            })
        }))
        describe('d4', (() => {
            test('random value of 1 results in 1', () => {
                expect(convertRandomToDieValue(1, 4)).toEqual(1)
            })
            test('random value of 2 results in 2', () => {
                expect(convertRandomToDieValue(2, 4)).toEqual(2)
            })
            test('random value of 4 results in 4', () => {
                expect(convertRandomToDieValue(4, 4)).toEqual(4)
            })
            test('random value of 400 results in 4', () => {
                expect(convertRandomToDieValue(400, 4)).toEqual(4)
            })
            test('random value of 401 results in 1', () => {
                expect(convertRandomToDieValue(401, 4)).toEqual(1)
            })
            test('random value of 1200 results in 4', () => {
                expect(convertRandomToDieValue(1200, 4)).toEqual(4)
            })
        }))
        describe('d6', (() => {
            test('random value of 1 results in 1', () => {
                expect(convertRandomToDieValue(1, 6)).toEqual(1)
            })
            test('random value of 2 results in 2', () => {
                expect(convertRandomToDieValue(2, 6)).toEqual(2)
            })
            test('random value of 6 results in 6', () => {
                expect(convertRandomToDieValue(6, 6)).toEqual(6)
            })
            test('random value of 600 results in 6', () => {
                expect(convertRandomToDieValue(600, 6)).toEqual(6)
            })
            test('random value of 601 results in 1', () => {
                expect(convertRandomToDieValue(601, 6)).toEqual(1)
            })
            test('random value of 1200 results in 4', () => {
                expect(convertRandomToDieValue(1200, 6)).toEqual(6)
            })
        }))
        describe('d8', (() => {}))
        describe('d10', (() => {}))
        describe('d12', (() => {}))
        describe('d16', (() => {}))
        describe('d20', (() => {}))
        describe('d50', (() => {}))
        describe('d100', (() => {}))
    })
})