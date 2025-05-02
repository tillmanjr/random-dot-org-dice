const CircularQueueNonBlocking = require('../../src/queue/CircularQueueNonBlocking')
const {
    createDiscardItemRule,
    createReplaceWithItemRule,
    isValidOverfillRule
}  = require('../../src/queue/OverfillRules')

describe('CircularQueueNonBlocking', () => {
    describe('Creation', () => {
        test('using constructor', () => {
            const options = CircularQueueNonBlocking.createOptions(6, null, createDiscardItemRule)
            const queue = new CircularQueueNonBlocking(options)

            expect(queue).not.toBeNull()
            expect(queue).not.toBeUndefined()
            expect(queue.toArray()).toHaveLength(6)
            expect(queue.isEmpty()).toBeTruthy()
        })

        test('using static createFromArray factory method', () => {
            const options = CircularQueueNonBlocking.createOptions(6, null, createDiscardItemRule)
            const items = [1,2,3,4,5,6]
            const queue = CircularQueueNonBlocking.createFromArray(items, options)

            expect(queue).not.toBeNull()
            expect(queue).not.toBeUndefined()
            expect(queue.toArray()).toHaveLength(6)
            expect(queue.isEmpty()).not.toBeTruthy()
        })

        test('throws on invalid capacity', () => {
            const options = CircularQueueNonBlocking.createOptions(undefined, null, createDiscardItemRule)
            expect(() => {
                const queue = new CircularQueueNonBlocking(options)
            }).toThrow()
        })

        test('throws on callback set to other than undefined or function', () => {
            const options = CircularQueueNonBlocking.createOptions(6, 2, createDiscardItemRule)
            expect(() => {
                const queue = new CircularQueueNonBlocking(options)
            }).toThrow()
        })
    })
    describe('public methods and properties', () => {
        test('clear method should empty queue', () => {
            const options = CircularQueueNonBlocking.createOptions(6, null, createDiscardItemRule)
            const items = [1,2,3,4,5,6]
            const queue = CircularQueueNonBlocking.createFromArray(items, options)
            
            expect(queue.length()).toEqual(6)

            queue.clear()
            expect(queue.size).toEqual(0)
            expect(queue.length()).toEqual(0)
            expect(queue.isEmpty()).toBeTruthy()
        })
        test('eviction callback ', () => {
            const rule = createReplaceWithItemRule()
            const f = jest.fn()
            const options = CircularQueueNonBlocking.createOptions(6, f, rule)
            const items = [1,2,3,4,5,6]
            const queue = CircularQueueNonBlocking.createFromArray(items, options)
            
            queue.enqueue(7)
            expect(f).toHaveBeenCalledWith(1)
        })
    })
    describe('enqueue and dequeue functionality', () => {
        test('enqueue  6 items then dequeue 1', () => {
            const options = CircularQueueNonBlocking.createOptions(6, null, createDiscardItemRule)
            const items = [1,2,3,4,5,6]
            const queue = new CircularQueueNonBlocking(options)
            items.forEach(item => {
                queue.enqueue(item)
            });
            
            expect(queue.toArray()).toHaveLength(6)
            expect(queue.isEmpty()).not.toBeTruthy()
            expect(queue.size).toEqual(6)

            const dequeued = queue.dequeue()
            expect(dequeued).toEqual(items[0])
            expect(queue.size).toEqual(5)
        })
        test('enqueue  6 items then dequeue 6', () => {
            const options = CircularQueueNonBlocking.createOptions(6, null, createDiscardItemRule)
            const items = [1,2,3,4,5,6]
            const queue = new CircularQueueNonBlocking(options)
            items.forEach(item => {
                queue.enqueue(item)
            });
            
            expect(queue.toArray()).toHaveLength(6)
            expect(queue.isEmpty()).not.toBeTruthy()
            expect(queue.size).toEqual(6)

            let dequeued = queue.dequeue()
            expect(dequeued).toEqual(items[0])
            expect(queue.size).toEqual(5)

            dequeued = queue.dequeue()
            dequeued = queue.dequeue()
            dequeued = queue.dequeue()
            dequeued = queue.dequeue()
            dequeued = queue.dequeue()
            expect(queue.size).toEqual(0)
            expect(queue.isEmpty()).toBeTruthy()
        })
        test('throws when empty then calling dequeue', () => {
            const rule = createDiscardItemRule()
            const f = jest.fn()
            const options = CircularQueueNonBlocking.createOptions(6, f, rule)
            const items = [1,2,3,4,5,6]
            const queue = new CircularQueueNonBlocking(options)
            items.forEach(item => {
                queue.enqueue(item)
            });
            
            queue.clear()
            expect( () => {let dequeued = queue.dequeue()}).toThrow()
        })
    })
    describe('when enqueueing over capacity', () => {
        test('discardItemRule will not enqueue any items over capacity', () => {
            const rule = createDiscardItemRule()
            const options = CircularQueueNonBlocking.createOptions(6, null, rule)
            const items = [1,2,3,4,5,6]
            const queue = CircularQueueNonBlocking.createFromArray(items, options)

            expect(queue.toArray()).toHaveLength(6)
            expect(queue.isEmpty()).not.toBeTruthy()
            expect(queue.size).toEqual(6)

            queue.enqueue(7)
            expect(queue.toArray()).toHaveLength(6)
            expect(queue.size).toEqual(6)
            expect(queue.toArray()).toStrictEqual(items)
        })
        test('replaceWithItem will replace queued item with new item', () => {
            const items = [1,2,3,4,5,6]
            const rule = createReplaceWithItemRule()
            expect(rule).toEqual('ReplaceWithItem')
            expect(isValidOverfillRule(rule)).toBeTruthy()
            
            const options = CircularQueueNonBlocking.createOptions(6, null, rule)

            const queue = CircularQueueNonBlocking.createFromArray(items, options)

            expect(queue.toArray()).toHaveLength(6)
            expect(queue.isEmpty()).not.toBeTruthy()
            expect(queue.size).toEqual(6)

            queue.enqueue(7)
            expect(queue.toArray()).toHaveLength(6)
            expect(queue.size).toEqual(6)
            expect(queue.toArray()[0]).toEqual(7)
            
            queue.enqueue(8)
            expect(queue.toArray()[0]).toEqual(7)         
            expect(queue.toArray()[1]).toEqual(8)
        })
    })
    describe('refill functionality', () => {
        test("refill when replaceWithItem will refill empty slots and replace existing", () => {
            const rule = createReplaceWithItemRule()
            const options = CircularQueueNonBlocking.createOptions(4, null, rule)
            const items = [1,2,3,4]
            const queue = CircularQueueNonBlocking.createFromArray(items, options)

            queue.dequeue()
            queue.dequeue()

            const newItems = [5, 6, 7 ]
            queue.refill(newItems)

            const expected = [5, 6, 7, 4]

            expect(queue.items).toEqual(expected)
        })

        test("refill when discardItemRule will refill empty slots", () => {
            const rule = createDiscardItemRule()
            const options = CircularQueueNonBlocking.createOptions(4, null, rule)
            const items = [1,2,3,4]
            const queue = CircularQueueNonBlocking.createFromArray(items, options)

            queue.dequeue()
            queue.dequeue()

            const newItems = [5, 6, 7, 8]
            queue.refill(newItems)

            const expected = [5, 6, 3, 4]

            expect(queue.items).toEqual(expected)
        })


    })
})