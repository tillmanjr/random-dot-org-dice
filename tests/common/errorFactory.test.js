const ErrorFactory = require('../../src/common/errorFactory')

describe('ErrorFactory', () => {
    test('createInvalidFaceCountException should return proper Error', ( )=> {
        const faceCount = 666
        const expectedMessage = `A die with ${faceCount} faces is not supported.`
        const error = ErrorFactory.createInvalidFaceCountException(faceCount)

        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(expectedMessage)
    })
    
    test('createRandomValueIntegerRequiredException should return proper Error', ( )=> {
        const expectedMessage = 'convertRandomToDieValue randomValue must be a number'
        const error = ErrorFactory.createRandomValueIntegerRequiredException()

        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(expectedMessage)
    })
    
    test('createDieFaceCountNumberRequiredException should return proper Error', ( )=> {
        const expectedMessage = 'convertRandomToDieValue dieFaceCount must be a number'
        const error = ErrorFactory.createDieFaceCountNumberRequiredException()

        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(expectedMessage)
    })

    test('createResponseStatusErrorException should return proper Error', ()=> {
        const expectedMessage = `Response status: ${404}`
        const error = ErrorFactory.createResponseStatusErrorException(404)

        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(expectedMessage)
    })

})