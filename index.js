const shellescape = require('shell-escape')
const execSync = require('child_process').execSync
const debug = require('debug')('sh:commands')

module.exports = exports = sh
exports.unsafe = unsafe

function sh(strings, ...params) {
  params = params.map(p => shellescape([p]))
  const command = interleave(strings, params)
  return execute(command)
}

function unsafe(strings, ...params) {
  const command = interleave(strings, params)
  return execute(command)
}

function interleave(one, two = []) {
  let str = ''
  for (let i = 0; i < one.length; i++) {
    str += one[i] + (two[i] || '')
  }
  return str
}

function execute(command) {
  try {
    debug(`executing: ${command}`)
    debug(`-> current directory: ${process.cwd()}`)
    const output = execSync(command, { stdio: 'pipe' }).toString()
    debug(`-> output:\n${indent(output)}`)
    return output
  }
  catch(error) {
    logError(error)
    throw error
  }
}

function logError(error) {
  if (!error.stderr) return

  console.error(indent(`\n${error.cmd}`))
  const stdErr = indent(error.stderr.toString())
  console.error(stdErr)
}

function indent(string) {
  return string.split('\n')
    .map(line => `  ${line}`)
    .join('\n')
}
