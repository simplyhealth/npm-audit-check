#!/usr/bin/env node
const program = require('commander');
const { spawn } = require('child_process')

program
  .version('1.0.0')
  .option('-i, --info <info policy>', 'Set policy for info vulnerabilities', parseInt)
  .option('-l, --low <low policy>', 'Set policy for low vulnerabilities', parseInt)
  .option('-m, --moderate <moderate policy>', 'Set policy for moderate vulnerabilities', parseInt)
  .option('-h, --high <high policy>', 'Set policy for high vulnerabilities', parseInt)
  .option('-c, --critical <critical policy>', 'Set policy for critical vulnerabilities', parseInt)
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
    console.log(`There are ${output.metadata.vulnerabilities.info} info vulnerabilities which is more than your allowed policy of ${program.info} `)
    vulnerable = true
  }

  if (program.low !== undefined && output.metadata.vulnerabilities.low > program.low) {
    console.log(`There are ${output.metadata.vulnerabilities.low} low vulnerabilities which is more than your allowed policy of ${program.low} `)
    vulnerable = true
  }

  if (program.moderate !== undefined && output.metadata.vulnerabilities.moderate > program.moderate) {
    console.log(`There are ${output.metadata.vulnerabilities.moderate} moderate vulnerabilities which is more than your allowed policy of ${program.moderate} `)
    vulnerable = true
  }

  if (program.high !== undefined && output.metadata.vulnerabilities.high > program.high) {
    console.log(`There are ${output.metadata.vulnerabilities.high} high vulnerabilities which is more than your allowed policy of ${program.high} `)
    vulnerable = true
  }

  if (program.critical !== undefined && output.metadata.vulnerabilities.critical > program.critical) {
    console.log(`There are ${output.metadata.vulnerabilities.critical} critical vulnerabilities which is more than your allowed policy of ${program.critical} `)
    vulnerable = true
  }

  if (vulnerable) {
    console.error("Run npm audit to get more details")
    process.exit(1)
  }
});
