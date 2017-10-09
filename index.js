const transform = value => {
  switch (typeof value) {
    case 'function':
      throw new TypeError("Can't transform functions")
    case 'undefined':
      return '@EXTENDED-JSON-UNDEFINED'
    case 'object': {
      if (Array.isArray(value)) return value.map(transform)
      if (value === null) return null
      if (value instanceof Date) return `@EXTENDED-JSON-DATE_${value.toJSON()}`
      if (value instanceof RegExp)
        return `@EXTENDED-JSON-REGEXP_${value.source}`
      const obj = {}
      Object.keys(value).forEach(key => (obj[key] = transform(value[key])))
      return obj
    }
    default:
      return value
  }
}

const invertTransformation = value => {
  if (value === '@EXTENDED-JSON-UNDEFINED') {
    return undefined
  }

  const dateMatch = /^@EXTENDED-JSON-DATE_(.*)$/.exec(value)
  if (dateMatch) {
    return new Date(dateMatch[1])
  }

  const regExpMatch = /^@EXTENDED-JSON-REGEXP_(.*)$/.exec(value)
  if (regExpMatch) {
    return new RegExp(regExpMatch[1])
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(invertTransformation)
    }
    if (value === null) {
      return null
    }

    const obj = {}
    Object.keys(value).forEach(
      key => (obj[key] = invertTransformation(value[key])),
    )
    return obj
  }

  return value
}

module.exports = {
  parse: str => invertTransformation(JSON.parse(str)),
  stringify: obj => JSON.stringify(transform(obj)),
}
