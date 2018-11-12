const fs = require('fs');
const { resolve } = require('path');
const _ = require('lodash');

module.exports = function(program) {
  let auditrc = {}
  let packagejson = {}

  // Load .auditrc
  try {
    auditrc = JSON.parse(
      fs.readFileSync(resolve(process.cwd(), '.auditrcs'), 'utf-8')
    )
  } catch (e) {}

  // Load package.json
  try {
    packagejson = JSON.parse(
      fs.readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')
    ).audit
  } catch (e) {}

  // Merge configs
  return _.merge(
    {},
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
