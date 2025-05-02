const {
    createDiscardItemRule,
} = require('../queue/OverfillRules')

const {convertRandomToDieValue} = require('../common/utils')

const {invalidRandomValue} = require(('../common/consts'))

const {getRandomIntegers} = require(('../randomProvider/randomOrg'))

const CircularQueueNonBlocking = require('../queue/CircularQueueNonBlocking')


/**
 * 
 *
 * @class DiceRoller
 */
class DiceRoller {
    constructor (config) {
        this.isReady = false
        this.randomsQueue = null
        this.config = config
        this.randomsRangeMin = config.bounds.rangeMin
        this.randomsRangeMax = config.bounds.rangeMax
        this.queueCapacity = config.queue.capacity
        this.queueRefillAt = config.queue.refillAt
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
        const randomIntegers = await getRandomIntegers(this.config)
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
     * Private method to encapsulate calling the RandomOrg random integers provider 
     *
     * @private
     * @return {Array.integer} 
     * @memberof DiceRoller
     */
    #fetchRandomIntegers() {
       return getRandomIntegers(this.config)
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
     * @param {integer} dieFaceCount face count of die to be rolled
     * @return {integer} result of roll
     * @memberof DiceRoller
     */
    async roll(dieFaceCount) {
        const rollsAvailable = await this.#ensureRandomsAvailable()
        if (rollsAvailable) {
            const nextRandomValue = this.randomsQueue.dequeue()
            return convertRandomToDieValue(nextRandomValue, dieFaceCount)
        }
        return invalidRandomValue
    }
}

module.exports = DiceRoller