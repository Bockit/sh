# sh

This module provides a template string handler for executing shell commands synchronously.

## Installation

`yarn add sh` or `npm install sh`

## Usage

* Running a shell script
* Interpolation
* Errors
* Debugging

### Running a shell script

Import the helper and use it as a template tag.

```javascript
const sh = require('@bockit/sh')

sh`echo hello world` // 'hello world'
```

### Interpolation

If you interpolate a value into your template tag it will be escaped by [`shell-escape`][shell escape] before being inserted into the command.

```javascript
const sh = require('@bockit/sh')
const person = '"world"'

sh`echo hello ${person}` // 'hello "world"'
```

If you want to prevent escaping, use the `sh.unsafe` template tag.

```javascript
const sh = require('@bockit/sh')
const person = '"world"'

sh.unsafe`echo hello ${person}` // 'hello world'
```

[shell escape]: https://www.npmjs.com/package/shell-escape

### Errors

If the command exists with a non-zero value it will log the command and the stderr output on stderr before re-throwing the error you would have received from [child_process.execSync][execSync]

```javascript
const sh = require('@bockit/sh')
const person = '"world'

sh.unsafe`echo hello ${person}`
```

Output:

```
  echo "hello
  /bin/sh: -c: line 0: unexpected EOF while looking for matching `"'
  /bin/sh: -c: line 1: syntax error: unexpected end of file
  
/Users/james/Documents/oss/@bockit/sh/index.js:35
    throw error
    ^

Error: Command failed: echo "hello
/bin/sh: -c: line 0: unexpected EOF while looking for matching `"'
/bin/sh: -c: line 1: syntax error: unexpected end of file

    at checkExecSyncError (child_process.js:483:13)
    at execSync (child_process.js:523:13)
    at execute (/Users/james/Documents/oss/@bockit/sh/index.js:31:12)
    at Function.unsafe (/Users/james/Documents/oss/@bockit/sh/index.js:16:10)
    at Test.<anonymous> (/Users/james/Documents/oss/@bockit/sh/test.js:40:29)
    at Test.bound [as _cb] (/Users/james/Documents/oss/@bockit/sh/node_modules/tape/lib/test.js:66:32)
    at Test.run (/Users/james/Documents/oss/@bockit/sh/node_modules/tape/lib/test.js:85:10)
    at Test.bound [as run] (/Users/james/Documents/oss/@bockit/sh/node_modules/tape/lib/test.js:66:32)
    at Immediate.next (/Users/james/Documents/oss/@bockit/sh/node_modules/tape/lib/results.js:71:15)
    at runCallback (timers.js:637:20)
error Command failed with exit code 1.
```

If you catch the error it will still log the command and output on stderr.

[execSync]: https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options

### Debugging

Run with `DEBUG=sh:commands` to see a log of all commands run and from which directory they are run. Example: 

```
  sh:commands executing: echo "hello" +4ms
  sh:commands -> current directory: /Users/james/Documents/oss/@bockit/sh +0ms
```

## Running Tests

```sh
yarn test
```
