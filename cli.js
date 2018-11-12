#!/usr/bin/env node
const program = require('commander');
const { spawn } = require('child_process');
const loadConfig = require('./lib/load-config');

program
  .version('1.0.0')
  .option('-i, --info <info policy>', 'Set policy for info vulnerabilities', parseInt)
  .option('-l, --low <low policy>', 'Set policy for low vulnerabilities', parseInt)
  .option('-m, --moderate <moderate policy>', 'Set policy for moderate vulnerabilities', parseInt)
  .option('-h, --high <high policy>', 'Set policy for high vulnerabilities', parseInt)
  .option('-c, --critical <critical policy>', 'Set policy for critical vulnerabilities', parseInt)
  .parse(process.argv);

let audit = spawn('npm', ['audit', '--json'])
let config = loadConfig(program)

let output = '';

audit.stdout.on('data', (data) => {
  output += data
});

audit.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

audit.on('close', (code) => {
  output = JSON.parse(output)

  let vulnerable = false

  if (config.policy.info !== undefined && output.metadata.vulnerabilities.info > config.policy.info) {
    console.log(`There are ${output.metadata.vulnerabilities.info} info vulnerabilities which is more than your allowed policy of ${config.policy.info} `)
    vulnerable = true
  }

  if (config.policy.low !== undefined && output.metadata.vulnerabilities.low > config.policy.low) {
    console.log(`There are ${output.metadata.vulnerabilities.low} low vulnerabilities which is more than your allowed policy of ${config.policy.low} `)
    vulnerable = true
  }

  if (config.policy.moderate !== undefined && output.metadata.vulnerabilities.moderate > config.policy.moderate) {
    console.log(`There are ${output.metadata.vulnerabilities.moderate} moderate vulnerabilities which is more than your allowed policy of ${config.policy.moderate} `)
    vulnerable = true
  }

  if (config.policy.high !== undefined && output.metadata.vulnerabilities.high > config.policy.high) {
    console.log(`There are ${output.metadata.vulnerabilities.high} high vulnerabilities which is more than your allowed policy of ${config.policy.high} `)
    vulnerable = true
  }

  if (config.policy.critical !== undefined && output.metadata.vulnerabilities.critical > config.policy.critical) {
    console.log(`There are ${output.metadata.vulnerabilities.critical} critical vulnerabilities which is more than your allowed policy of ${config.policy.critical} `)
    vulnerable = true
  }

  if (vulnerable) {
    console.error("Run npm audit to get more details")
    process.exit(1)
  }
});
