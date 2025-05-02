"use strict;"

const rangeMin = 1;
const rangeMax = 1200 // Least common denominator of 3,4,6,8,10,12,16,20,50,100
const range = (rangeMax - rangeMin + 1)

const supportedFaceCounts = [
    3,
    4,
    6,
    8,
    10,
    12,
    16,
    20,
    50,
    100
]

const supportedDiceFaces = Object.freeze({
    d3:   supportedFaceCounts[0],
    d4:   supportedFaceCounts[1],
    d6:   supportedFaceCounts[2],
    d8:   supportedFaceCounts[3],
    d10:  supportedFaceCounts[4],
    d12:  supportedFaceCounts[5],
    d16:  supportedFaceCounts[6],
    d20:  supportedFaceCounts[7],
    d50:  supportedFaceCounts[8],
    d100: supportedFaceCounts[9],
})

const invalidRandomValue = -1

module.exports = {
    invalidRandomValue,
    supportedDiceFaces
}