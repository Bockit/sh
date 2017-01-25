const test = require('tape')
const sh = require('./index')

test('it executes commands', function(assert) {
  assert.plan(1)

  const result = sh`echo hello`
  assert.equal(result, 'hello\n')
})

test('it handles interpolated arguments', function(assert) {
  assert.plan(1)

  const message = 'hello'
  const result = sh`echo ${message}`
  assert.equal(result, 'hello\n')
})

test('it escapes interpolated arguments', function(assert) {
  assert.plan(1)

  const message = '"hello"'
  const result = sh`echo ${message}`
  assert.equal(result, '"hello"\n')
})

test('it does not escape interpolated arguments when you run unsafe', function(assert) {
  assert.plan(1)

  const message = '"hello"'
  const result = sh.unsafe`echo ${message}`
  assert.equal(result, 'hello\n')
})

test('it throws if the command has a non-zero exit code', function(assert) {
  assert.plan(2)

  const message = '"hello'
  try {
    const result = sh.unsafe`echo ${message}`
  }
  catch(error) {
    // duck type to see it's an execSync error
    assert.ok(error.cmd, 'is an execSync error')
    assert.pass('throws when there is an error running the command')
  }
})

test('it handles multiline', function(assert) {
  assert.plan(2)

  let result
  let expected

  result = sh`
    echo Hello, world
    echo Goodbye, cruel world!
  `
  expected = 'Hello, world\nGoodbye, cruel world!\n'

  assert.equal(result, expected)

  result = sh`
    value="Hello"
    echo $value, world!
  `
  expected = 'Hello, world!\n'

  assert.equal(result, expected)
})
