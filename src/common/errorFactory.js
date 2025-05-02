
/** @type {Object} */
const ErrorFactory = {
    createInvalidFaceCountException: (dieFaceCount) => {
        return new Error(`A die with ${dieFaceCount} faces is not supported.`)
    },

    createRandomValueIntegerRequiredException: () => {
        return new Error('convertRandomToDieValue randomValue must be a number')
    },

    createDieFaceCountNumberRequiredException: () => {
        return new Error('convertRandomToDieValue dieFaceCount must be a number')
    },

    createResponseStatusErrorException: (status) => {
        return new Error(`Response status: ${status}`)
    }
}

module.exports = ErrorFactory
