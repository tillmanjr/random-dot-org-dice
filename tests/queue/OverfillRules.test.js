const {
    createDiscardItemRule,
    createReplaceWithItemRule,
    isDiscardItemRule,
    isReplaceWithItemRule,
    isValidOverfillRule
}  = require('../../src/queue/OverfillRules')

describe('OverfillRules', () => {
    describe('DiscardItem rule', () => {
        test('createDiscardItemRule returns DiscardItem', () => {
            expect(createDiscardItemRule()).toEqual('DiscardItem')
        })
        test('is accepted by isValidOverfillRule', () => {
            expect(isValidOverfillRule(createDiscardItemRule())).toBeTruthy()
        })
        test('is accepted by isDiscardItemRule', () => {
            expect(isDiscardItemRule(createDiscardItemRule())).toBeTruthy()
        })
        test('is not accepted by isReplaceWithItemRule', () => {
            expect(isReplaceWithItemRule(createDiscardItemRule())).not.toBeTruthy()
        })
    })

    describe('ReplaceWithItem rule', () => {
        test('createReplaceWithItemRule returns ReplaceWithItem', () => {
            expect(createReplaceWithItemRule()).toEqual('ReplaceWithItem')
        })
        test('is accepted by isValidOverfillRule', () => {
            expect(isValidOverfillRule(createReplaceWithItemRule())).toBeTruthy()
        })
        
        test('is not accepted by isReplaceWithItemRule', () => {
            expect(isReplaceWithItemRule(createReplaceWithItemRule())).toBeTruthy()
        })
        test('is not accepted by isDiscardItemRule', () => {
            expect(isDiscardItemRule(createReplaceWithItemRule())).not.toBeTruthy()
        })
    })
})