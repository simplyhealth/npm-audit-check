# ARCHIVED
03/09/2021
This repository has been archived. It is now read only. This can be undone if required.

# npm-audit-check
Enforces npm audit policies

Designed to be used within a build process to interrogate the output from ```npm audit --json``` and return an error exit code if any of the vulnerability levels are higher than those specified.

## Use

```bash
npm-audit-check [options]
```

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

You can also create a `.auditrc` file with your security policy or add it to your `package.json` file;

### .auditrc
```json
{
  "policy": {
    "critical": 10,
    "high": 5
  }
}
```

### package.json
```json
...
  "audit": {
    "policy": {
      "critical": 10,
      "high": 5
    }
  }
```

**Note:** The security policy is resolved in the following priority; command line arguments > `package.json` > `.auditrc`

**Note:** Not specifying any maximum vulnerabilities, will mean that npm-audit-check will not perform any checks.

### Examples
```bash
npm-audit-check --critical 0
```
This will return an exit code set to 1 (error) if npm audit reports any critical vulnerabilities

```bash
npm-audit-check --critical 0 --high 5 --moderate 20
```
This will return an exit code set to 1 (error) if npm audit reports any critical vulnerabilities or more than 5 high vulnerabilities or more than 20 moderate vulnerabilities.

```bash
npm-audit-check --critical 0 --high 5 --moderate 20 -t
```
As above but the -t option means that the vulnerabilities will be reported but the check will return an exit code set to 0 (success)

### Sample Output
#### Failure
```
npm-audit-check --low 0 --moderate 0 --high 0 --critical 0
There are 672 low vulnerabilities which is more than your allowed policy of 0
There are 36 moderate vulnerabilities which is more than your allowed policy of 0
There are 20 high vulnerabilities which is more than your allowed policy of 0
There are 5 critical vulnerabilities which is more than your allowed policy of 0
---------------------------------
Run npm audit to get more details
---------------------------------
```

#### Success
```
npm-audit-check --critical 10
---------------------------------------------------
No vulnerabilities found above the levels specified
---------------------------------------------------
```
