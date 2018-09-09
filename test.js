import crypto from 'crypto'
import test from 'ava'
import baseConvertIntArray from '.'

test('converts base16 values to bytes', t => {
  const random = crypto.randomBytes(256)
  random[0] = 1 // Avoid leading zeros.
  const hexArray = Array.from(random.toString('hex'), char => parseInt(char, 16))
  const byteArray = baseConvertIntArray(hexArray, {from: 16, to: 256})
  t.deepEqual(random, Buffer.from(byteArray))
})

test('does not preserve leading zeros if length is not fixed', t => {
  const hexArray = Array.from('00635c08', char => parseInt(char, 16))
  const byteArray = baseConvertIntArray(hexArray, {from: 16, to: 256})
  t.deepEqual(Buffer.from('635c08', 'hex'), Buffer.from(byteArray))
})

test('preserves leading zeros if length is fixed', t => {
  const hexArray = Array.from('00635c08', char => parseInt(char, 16))
  const byteArray = baseConvertIntArray(hexArray, {from: 16, to: 256, fixedLength: 4})
  t.deepEqual(Buffer.from('00635c08', 'hex'), Buffer.from(byteArray))
})

test('may still strip leading zeros if length is fixed to exclude them', t => {
  const hexArray = Array.from('00635c08', char => parseInt(char, 16))
  const byteArray = baseConvertIntArray(hexArray, {from: 16, to: 256, fixedLength: 3})
  t.deepEqual(Buffer.from('635c08', 'hex'), Buffer.from(byteArray))
})

test('throws if input is too long given the fixed length', t => {
  t.throws(() => {
    const hexArray = Array.from('01635c08', char => parseInt(char, 16))
    baseConvertIntArray(hexArray, {from: 16, to: 256, fixedLength: 3})
  }, {
    message: 'Fixed length of 3 is too small, expected at least 4',
    name: 'RangeError'
  })
})
