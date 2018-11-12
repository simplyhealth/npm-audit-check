#!/usr/bin/env node
const program = require('commander');
const { spawn } = require('child_process')
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

  if (program.info !== undefined && output.metadata.vulnerabilities.info > program.info) {
    console.log(`There are ${output.metadata.vulnerabilities.info} info vulnerabilities which is more than your allowed policy of ${program.info}`)
    vulnerable = true
  }

  if (program.low !== undefined && output.metadata.vulnerabilities.low > program.low) {
    console.log(`There are ${output.metadata.vulnerabilities.low} low vulnerabilities which is more than your allowed policy of ${program.low}`)
    vulnerable = true
  }

  if (program.moderate !== undefined && output.metadata.vulnerabilities.moderate > program.moderate) {
    console.log(`There are ${chalk.yellow(output.metadata.vulnerabilities.moderate)} moderate vulnerabilities which is more than your allowed policy of ${chalk.yellow(program.moderate)}`)
    vulnerable = true
  }

  if (program.high !== undefined && output.metadata.vulnerabilities.high > program.high) {
    console.log(`There are ${chalk.red(output.metadata.vulnerabilities.high)} high vulnerabilities which is more than your allowed policy of ${chalk.red(program.high)}`)
    vulnerable = true
  }

  if (program.critical !== undefined && output.metadata.vulnerabilities.critical > program.critical) {
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
