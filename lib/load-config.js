const fs = require('fs');
const { resolve } = require('path');
const _ = require('lodash');

/**
 * Loads and parses a given config file
 * @param  {string} filename
 * @param  {boolean} verbose
 * @return {object}
 */
function loadFile(filename, verbose) {
  let file = resolve(process.cwd(), filename)

  if (verbose) console.log(`Loading ${filename} from ${file}`)

  try {
    return JSON.parse(
      fs.readFileSync(file, 'utf-8')
    )
  } catch (e) {
    if (verbose) console.log(`Could not load ${filename}`, e)
    return {}
  }
}

/**
 * Loads and merges config files
 * @param  {object} program
 * @return {object}
 */
function loadConfig(program) {
  let auditrc = loadFile('.auditrc', program.verbose)
  let packagejson = loadFile('package.json', program.verbose).audit

  return _.merge(
    {
      policy: {
        info: undefined,
        low: undefined,
        moderate: undefined,
        high: undefined,
        critical: undefined
      }
    },
    auditrc,
    packagejson,
    {
      policy: {
        info: program.info,
        low: program.low,
        moderate: program.moderate,
        high: program.high,
        critical: program.critical
      }
    }
  )
}

module.exports = loadConfig
