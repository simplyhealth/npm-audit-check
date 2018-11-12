# npm-audit-check
Enforces npm audit policies

Designed to be used within a build process to interrogate the output from ```npm audit --json``` and return an error exit code if any of the vulnerability levels are higher than those specified.

## Use

```npm-audit-check [options]```

| Option | Optional? | Use |
| ------ | --------- | --- |
| -V, --version | Yes | output the version number
| -i, --info <info policy> | Yes | Set the maximum number of info vulnerabilities allowed |
| -l, --low <low policy>  | Yes | Set the maximum number of low vulnerabilities allowed |
| -m, --moderate <moderate policy> | Yes | Set the maximum number of moderate vulnerabilities allowed |
| -h, --high <high policy> | Yes | Set the maximum number of high vulnerabilities allowed |
| -c, --critical <critical policy> | Yes | Set the maximum number of critical vulnerabilities allowed |
| -t, --test | Yes | Report on level of vulnerabilities but return a success exit code |
| --help | Yes | Output usage information |

**Note:** Not specifying any maximum vulnerabilities, will mean that npm-audit-check will not perform any checks.

### Examples
```npm-audit-check --critical 0```
This will return an exit code set to 1 (error) if npm audit reports any critical vulnerabilities

```npm-audit-check --critical 0 --high 5 --moderate 20```
This will return an exit code set to 1 (error) if npm audit reports any critical vulnerabilities or more than 5 high vulnerabilities or more than 20 moderate vulnerabilities.

```npm-audit-check --critical 0 --high 5 --moderate 20 -t```
As above but the -t option means that the vulnerabilities will be reported but the check will return an exit code set to 0 (success)

