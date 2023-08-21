export function camelToKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function textToValidClassname(str: string) {
  // Remove invalid characters
  let className = str.toLowerCase().replace(/[^a-zA-Z_-|0-9]/g, '_')

  // If it starts with a hyphen, ensure it's not followed by a digit
  if (str.startsWith('-')) {
    className = str.replace(/^-([0-9])/, '_$1')
  }

  return className
}
