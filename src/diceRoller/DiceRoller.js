const {
    createDiscardItemRule,
} = require('../queue/OverfillRules')

const { 
    composeFetchRandomsHistoryItem,
    composeRollHistoryItem,
    convertRandomToDieValue
} = require('../common/utils')

const { invalidRandomValue } = require(('../common/consts'))

const { getRandomIntegers } = require(('../randomProvider/randomOrg'))

const CircularQueueNonBlocking = require('../queue/CircularQueueNonBlocking')


/**
 * 
 *
 * @class DiceRoller
 */
class DiceRoller {
    constructor(config, rollHistory, fetchHistory) {
        this.isReady = false
        this.randomsQueue = null
        this.config = config
        this.randomsRangeMin = config.bounds.rangeMin
        this.randomsRangeMax = config.bounds.rangeMax
        this.queueCapacity = config.queue.capacity
        this.queueRefillAt = config.queue.refillAt
        this.fetchHistory = fetchHistory
        this.rollHistory = rollHistory
    }

    /**
     * Initializes dice roller.
     * Upon completion queue has been created and is available with a full set of random values
     *
     * @public
     * @return {void} 
     * @memberof DiceRoller
     */
    async init() {
        const randomIntegersResult = await getRandomIntegers(this.config)
        const randomIntegers = randomIntegersResult.success
            ? randomIntegersResult.data
            : []

        const randomCount = randomIntegers.length

        const rule = createDiscardItemRule()
        const options = CircularQueueNonBlocking.createOptions(this.queueCapacity, null, rule)
        this.randomsQueue = CircularQueueNonBlocking.createFromArray(randomIntegers, options)
        this.isReady = true

        return randomCount
    }

    /**
     * Private method to log message with a Refill event occurs
     * 
     * @private
     * @return {void}
     * @memberof DiceRoller
     */
    #logRefillEvent() {
        console.log(`Refilling queue. ${this.randomsQueue.size} randoms of ${this.randomsQueue.capacity} capacity available.`)
    }

    
    /**
     * 
     *
     * @param {*} fetchResult
     * @memberof DiceRoller
     */
    async #logFetchRandomIntegersEvent(fetchResult) {
        if (this.fetchHistory) {
            const payload = composeFetchRandomsHistoryItem(fetchResult)
            this.fetchHistory.add(payload)
        }
        return Promise.resolve()
    }

    
    /**
     *
     *
     * @param {*} timestamp
     * @param {*} faces
     * @param {*} roll
     * @param {*} randomValue
     * @return {*} 
     * @memberof DiceRoller
     */
    async #logDiceRoll(timestamp, faces, roll, randomValue) {
        if (this.rollHistory) {
            const payload = composeRollHistoryItem(timestamp, faces, roll, randomValue)
            this.rollHistory.add(payload)
        }
        return Promise.resolve()
    }

    /**
     * Private method to encapsulate calling the RandomOrg random integers provider 
     *
     * @private
     * @return {Array.integer} 
     * @memberof DiceRoller
     */
    #fetchRandomIntegers() {
        const fetchResult = getRandomIntegers(this.config)
        this.#logFetchRandomIntegersEvent(fetchResult)

        if (fetchResult.success) {
            return fetchResult.data
        }
    }

    /**
     * Private method which checks that random values are available in queue
     * If insufficient random values are not available it refills the queue
     * before returning
     *
     * @private
     * @return {Boolean} 
     * @memberof DiceRoller
     */
    async #ensureRandomsAvailable() {
        if (this.randomsQueue.size < this.queueRefillAt) {
            this.#logRefillEvent()
            const moreRandoms = await this.#fetchRandomIntegers()
            this.randomsQueue.refill(moreRandoms)
            return true
        }
        return Promise.resolve(true)
    }

    /**
    * Returns the result of a random roll.
    *
    * @public
    * @param {integer} dieFaceCount Face count of die to be rolled
    * @return {integer} Result of roll
    * @memberof DiceRoller
    */
    async roll(dieFaceCount) {
        const rollsAvailable = await this.#ensureRandomsAvailable()
        if (rollsAvailable) {
            const nextRandomValue = this.randomsQueue.dequeue()
            const result = convertRandomToDieValue(nextRandomValue, dieFaceCount)
            this.#logDiceRoll(new Date().getTime(), dieFaceCount, result, nextRandomValue)
            return result
        }
        return invalidRandomValue
    }

    getRollHistory(count, offset) {
        if (this.rollHistory) {
            return this.rollHistory.history(count, offset)
        }
        return []
    }

    getFetchRandomsHistory(count, offset) {
        if (this.fetchHistory) {
            return this.fetchHistory.history(count, offset)
        }
        return []
    }
    
}

module.exports = DiceRoller