const requiredFields = body => {
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)

  let required = []
  for (let i = 0; i < length; i++) {
    if (!values[i]) required.push(keys[i])
  }

  if (required.length) return `${required.join(', ')} required`
  return
}

module.exports = {
  requiredFields,
}
