const {
    createDiscardItemRule,
    isDiscardItemRule,
    isValidOverfillRule
} = require('./OverfillRules')


/**
 *
 *
 * @class CircularQueueNonBlocking
 */
class CircularQueueNonBlocking {
  constructor({capacity, evictionCallback, overfillRule}) {
    if (typeof capacity !== 'number' || capacity < 1) {
      throw new Error('Please specify capacity of the Queue')
    }

    if (!!evictionCallback && typeof evictionCallback !== 'function') {
      throw new Error('evictionCallback should be a function')
    }

    this.overfillRule = isValidOverfillRule(overfillRule)
      ? overfillRule
      : createDiscardItemRule()

    this.head = 0
    this.tail = 0
    this.size = 0
    this.items = Array.from({ length: capacity })
    this.capacity = capacity
    this.evictionCallback = evictionCallback || null
  }


  
  /**
   * Enqueue (add) an item to the queue
   *
   * @public
   * @param {any} item
   * @return {Boolean} 
   * @memberof CircularQueueNonBlocking
   */
  enqueue(item) {
    if (this.isFull()) {
      if (isDiscardItemRule(this.overfillRule)) {
        return false
      }

      const removedItem = this.#rotateHead()

      if (this.evictionCallback) {
        this.evictionCallback(removedItem)
      }

      this.items[this.tail] = item

      this.tail = (this.tail + 1) % this.capacity
      return true
    }

    this.items[this.tail] = item
    this.tail = (this.tail + 1) % this.capacity
    this.size++
    return true
  }

  
  /**
   * Dequeue one item from the queue
   *
   * @public
   * @return {any} 
   * @memberof CircularQueueNonBlocking
   */
  dequeue() {
    if (this.isEmpty()) throw new Error('Queue is empty!')

    const removedItem = this.peek()

    this.items[this.head] = undefined

    this.head = (this.head + 1) % this.capacity
    this.size--
    return removedItem
  }
  
  
  /**
   * Peek at head item without dequeueing it
   *
   * @public
   * @return {any} 
   * @memberof CircularQueueNonBlocking
   */
  peek() {
    return this.items[this.head]
  }
  
  
  /**
   * Rotate head item to end of queue
   *
   * @private
   * @return {*} 
   * @memberof CircularQueueNonBlocking
   */
  #rotateHead() {
    const removedItem = this.peek()
    this.head = (this.head + 1) % this.capacity

    return removedItem
  }

  
  /**
   * Is the queue filled to capacity
   *
   * @return {boolean} 
   * @memberof CircularQueueNonBlocking
   */
  isFull() {
    return this.capacity === this.size
  }

  
  /**
   * Is the queue empty
   *
   * @return {*} 
   * @memberof CircularQueueNonBlocking
   */
  isEmpty() {
    return this.size === 0
  }
  
  
  /**
   * Current number of items in the queue (same as .size)
   *
   * @public
   * @return {integer} 
   * @memberof CircularQueueNonBlocking
   */
  length() {
    return this.size
  }
  
  
  /**
   * Remove all items from the queue
   *
   * @public
   * @memberof CircularQueueNonBlocking
   */
  clear() {
    this.items = []
    this.head = 0
    this.tail = 0
    this.size = 0
  }
  
  
  /**
   * returns an array populated with the queued items
   *
   * @return {*} 
   * @memberof CircularQueueNonBlocking
   */
  toArray() {
    return [...this.items]
  }

  
  /**
   * Fills the queue from an array of items
   *
   * @param {*} items
   * @memberof CircularQueueNonBlocking
   */
  refill(items) {
    items.forEach( (item) => {
      this.enqueue(item)
    })
  }

  
  /**
   * Factory for creating a new CircularQueueNonBlocking populated from an array of values
   *
   * @static
   * @param {items} items
   * @param {Array} options
   * @return {CircularQueueNonBlocking} 
   * @memberof CircularQueueNonBlocking
   */
  static createFromArray(items, options) {
    const result = new CircularQueueNonBlocking(options)
    items.forEach(item => result.enqueue(item))

    return result
  }

  
  /**
   * Creates a config object suitable for passing to CircularQueueNonBlocking.createFromArray
   *
   * @static
   * @param {integer} capacity
   * @param {function} evictionCallback
   * @param {string} overfillRule
   * @return {object} 
   * @memberof CircularQueueNonBlocking
   */
  static createOptions(capacity, evictionCallback, overfillRule) {
    return {capacity, evictionCallback, overfillRule}
  }
}

module.exports = CircularQueueNonBlocking