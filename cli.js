#!/usr/bin/env node
const program = require('commander');
const { spawn } = require('child_process');
const chalk = require('chalk')

program
  .version('1.0.0')
  .option('-i, --info <info policy>', 'Set the maximum number of info vulnerabilities allowed', parseInt)
  .option('-l, --low <low policy>', 'Set the maximum number of low vulnerabilities allowed', parseInt)
  .option('-m, --moderate <moderate policy>', 'Set the maximum number of moderate vulnerabilities allowed', parseInt)
  .option('-h, --high <high policy>', 'Set the maximum number of high vulnerabilities allowed', parseInt)
  .option('-c, --critical <critical policy>', 'Set the maximum number of critical vulnerabilities allowed', parseInt)
  .option('-t, --test', 'Report on level of vulnerabilities but return a success exit code')
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
    console.log(`There are ${output.metadata.vulnerabilities.info} info vulnerabilities which is more than your allowed policy of ${program.info}`)
    vulnerable = true
  }

  if (config.policy.low !== undefined && output.metadata.vulnerabilities.low > config.policy.low) {
    console.log(`There are ${output.metadata.vulnerabilities.low} low vulnerabilities which is more than your allowed policy of ${program.low}`)
    vulnerable = true
  }

  if (config.policy.moderate !== undefined && output.metadata.vulnerabilities.moderate > config.policy.moderate) {
    console.log(`There are ${chalk.yellow(output.metadata.vulnerabilities.moderate)} moderate vulnerabilities which is more than your allowed policy of ${chalk.yellow(program.moderate)}`)
    vulnerable = true
  }

  if (config.policy.high !== undefined && output.metadata.vulnerabilities.high > config.policy.high) {
    console.log(`There are ${chalk.red(output.metadata.vulnerabilities.high)} high vulnerabilities which is more than your allowed policy of ${chalk.red(program.high)}`)
    vulnerable = true
  }

  if (config.policy.critical !== undefined && output.metadata.vulnerabilities.critical > config.policy.critical) {
    console.log(`There are ${chalk.magenta(output.metadata.vulnerabilities.critical)} critical vulnerabilities which is more than your allowed policy of ${chalk.magenta(program.critical)}`)
    vulnerable = true
  }

  if (vulnerable) {
    console.error("---------------------------------")
    console.error("Run npm audit to get more details")
    console.error("---------------------------------")
    if (!program.test) {
      process.exit(1)
    }
  } else {
    console.log("---------------------------------------------------")
    console.log("No vulnerabilities found above the levels specified")
    console.log("---------------------------------------------------")
  }
});
