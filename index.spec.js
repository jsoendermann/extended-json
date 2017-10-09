const { stringify, parse } = require('.')

const DATE_STRING = new Date('1989/10/3').toJSON()

it('should stringify dates', () => {
  const s = stringify(new Date(DATE_STRING))
  expect(s).toBe(`"@EXTENDED-JSON-DATE_${DATE_STRING}"`)
})

it('should parse dates', () => {
  const d = parse(`"@EXTENDED-JSON-DATE_${DATE_STRING}"`)
  expect(d instanceof Date).toBeTruthy()
})

it('should stringify objects containing dates', () => {
  const s = stringify({ d: new Date(DATE_STRING) })
  expect(s).toBe(`{"d":"@EXTENDED-JSON-DATE_${DATE_STRING}"}`)
})

it('should parse objects containing dates', () => {
  const obj = parse(`{"d": "@EXTENDED-JSON-DATE_${DATE_STRING}"}`)
  expect(obj.d instanceof Date).toBeTruthy()
})

it('should stringify arrays', () => {
  const s = stringify([1, '2'])
  expect(s).toBe(`[1,\"2\"]`)
})

it('should stringify numbers', () => {
  const s = stringify(1)
  expect(s).toBe('1')
})

it('should parse numbers', () => {
  const n = parse('1')
  expect(n).toBe(1)
})

it('should handle all kinds of stuff', () => {
  const obj = {
    u: undefined,
    r: /arst/,
    d: new Date(),
    n: null,
    a: [1, null, new Date(), undefined],
    obj: { oa: 1, ob: null, oc: new Date(), od: undefined },
  }

  const andBackAgain = parse(stringify(obj))
  expect(andBackAgain).toEqual(obj)
})
