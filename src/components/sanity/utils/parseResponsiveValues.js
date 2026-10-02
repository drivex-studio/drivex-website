import theme from '@/libs/constants/screens'

function parseRem(value) {
  return Number.parseFloat(value.replace('rem', ''))
}

export function parseResponsiveValues(str) {
  let result = {}
  const screenKeys = Object.keys(theme.screens).join('|')
  const regex = RegExp(`^(${screenKeys}):(.+)$`)

  for (let part of str.split(/\s+/)) {
    let match = part.match(regex)
    if (match) {
      let [, screen, value] = match
      if (value && screen) {
        result[screen] = {
          value: value,
          resolvedWidth: theme.screens[screen]
        }
      }
    } else {
      result.DEFAULT = {
        value: part
      }
    }
  }

  return Object.fromEntries(
    Object.entries(result).sort(([, { resolvedWidth: a }], [, { resolvedWidth: b }]) =>
      a || b ? (a ? (b ? parseRem(b) - parseRem(a) : -1) : 1) : 0
    )
  )
}