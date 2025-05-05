'use strict;'

const {composeGetRandomIntegersResult} = require('../common/utils')
const ErrorFactory = require('../common/errorFactory')


/**
 * Returns the random.org GET url for fetching a set of random integers  
 *
 * @param {string} host
 * @param {string} path
 * @param {integer} lowerBound
 * @param {integer} upperBound
 * @param {integer} count
 * @return {string} 
 */
function composeRandomOrgUrl(host, path, lowerBound, upperBound, count) {
  return `${host}/${path}/?num=${count}&min=${lowerBound}&max=${upperBound}&col=1&base=10&format=plain&rnd=new`
}

// http://www.random.org/integers/?num=10&min=1&max=6&col=1&base=10&format=plain&rnd=new


/**
 * Fetches a set of random integers from random.org
 *
 * @param {Object} config
 * @param {function} urlCallback optional callback for composing the GET URL used
 * @return {Array.integer} 
 */
async function getRandomIntegers(config, urlCallback) {
  const host = config.randomOrg.host
  const path = config.randomOrg.path

  const lowerBound = config.bounds.rangeMin
  const upperBound = config.bounds.rangeMax
  
  const count = config.queue.capacity

  const url = urlCallback
    ? urlCallback(host, path, lowerBound, upperBound, count)
    : composeRandomOrgUrl(host, path, lowerBound, upperBound, count)
    try {
      const response = await fetch(url);

      const success = response.ok

      if (!success) {
        return composeGetRandomIntegersResult(false, null, response.status, response.statusText)
      }
  
      const body = await response.text();
      const result = body.split('\n')
      const randoms = result.map(x => parseInt(x))

      const data = randoms.length > count
        ? randoms.slice(0, count - 1)
        : randoms

      return composeGetRandomIntegersResult(true, response.status, data)
    } catch (error) {
      return composeGetRandomIntegersResult(false, null, -1, error.message)
    }
  }
  
module.exports = {
  getRandomIntegers
}
