
/**
 * Very simple class for holding a list of history items and retrieving subsets of them
 * Not durable and is intended as a temporary solution
 *
 * @class SimpleHistory
 */
class SimpleHistory {
    #history;

    constructor() {
        this.#history = []
    }

    add(item) {
        this.#history.push(item)
    }

    get length() {
        return this.#history.length
    }
    
    /**
     * 
     * Result is always sorted most recent to oldest
     *
     * @param {*} count
     * @param {*} offset
     * @return {*} 
     * @memberof SimplyHistory
     */
    history(count, offset) {
        const reversed = [...this.#history].reverse()
        const recordCount = this.length

        // when count is 0 or unspecified
        if (!count || count <= 0) {
            // and no offset return all history
            if (!offset || offset <= 0) {
                return reversed
            } 
            // and offset greater than number of records return []
            if (offset > recordCount) {
                return []
            }
            return reversed.slice(Math.max(offset, 0))
        }
        
        // when count is specified
        // and count exceeds number of records
        if (count >= recordCount) {
            // and no offset is specified, return all history
            if (!offset || offset <= 0) {
                return reversed
            } 
            return reversed.slice( Math.max(offset, 0), Math.max(offset, 0) + count)
        }

        if (!offset || offset <= 0) {
            return reversed.slice(0, count)
        } 
        return reversed.slice(Math.max(offset, 0), Math.max(offset, 0) + count)
    }
}

module.exports = SimpleHistory

/*

const history = new SimplyHistory()
history.add(1)
history.add(2)
history.add(3)
history.add(4)
history.add(5)
history.add(6)
history.add(7)
history.add(8)
history.add(9)
history.add(10)

console.dir(history.history())
console.dir(history.history(0))
console.dir(history.history(5))
console.dir(history.history(10))
console.dir(history.history(12))

console.dir(history.history(0, 4))
console.dir(history.history(4, 4))
console.dir(history.history(12, 4))
*/