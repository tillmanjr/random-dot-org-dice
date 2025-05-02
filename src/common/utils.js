"use strict;"

const {
    supportedDiceFaces
} = require('./consts')

const ErrorFactory = require('./errorFactory')

/**
 * Is the passed value of type number
 *
 * @public
 * @param {any} value
 */
const isNumber = (value) => (typeof value === 'number')

/**
 * Is the passed value not of type number
 *
 * @public
 * @param {any} value
 */
const isNotNumber = value =>(!isNumber(value))


/**
 * Does the value passed equate to a supported number of die faces
 *
 * @public
 * @param {integer} value
 * @return {Boolean} 
 */
const isSupportedFaceCount = (value) => {
    const propName = `d${value}`
    if (Object.hasOwn(supportedDiceFaces, propName)) {
        return supportedDiceFaces[propName] === value
    }
    return false
}

/**
 * Converts a random value to a die roll result
 * The queue does not directly stored die-specific values.
 * The stored values can be converted to die-specific values by providing 
 * the number of faces for a supported die. This function performs said conversion.  
 *
 * @public
 * @param {*} randomValue
 * @param {*} dieFaceCount
 * @return {*} 
 */
const convertRandomToDieValue = (randomValue, dieFaceCount) => {
    if ( isNotNumber(randomValue) ) { throw ErrorFactory.createRandomValueIntegerRequiredException() }
    if ( isNotNumber(dieFaceCount) ) { throw ErrorFactory.createDieFaceCountNumberRequiredException() }
    if ( !isSupportedFaceCount(dieFaceCount) ) { throw ErrorFactory.createInvalidFaceCountException(dieFaceCount) }

    if (randomValue === 1) {return 1}
    
    const remainder = (randomValue) % dieFaceCount
    return remainder === 0
        ? dieFaceCount
        : remainder
}

module.exports = {
    test: {
        convertRandomToDieValue,
        isNumber,
        isNotNumber,
        isSupportedFaceCount
    },
    convertRandomToDieValue
}
