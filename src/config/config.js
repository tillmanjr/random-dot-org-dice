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

module.exports = config
